import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/export-data";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(401);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.EntrySnapshot, "getAllForUser").mockResolvedValue([mocks.fullEntry]),
    );
    spies.use(spyOn(di.Adapters.Emotions.AlarmDirectory, "listForUser").mockResolvedValue([mocks.alarm]));

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("application/gzip");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="export-${mocks.T0}.tar"`,
    );

    const bytes = new Uint8Array(await response.arrayBuffer());
    const tar = new TextDecoder().decode(Bun.gunzipSync(bytes));

    expect(tar).toContain(`entry-export-${mocks.T0}.csv`);
    expect(tar).toContain(`alarm-export-${mocks.T0}.csv`);
  });
});
