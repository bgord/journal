import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { db } from "+infra/db";
import { EnvironmentLoader } from "+infra/env";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/publishing/link/${mocks.shareableLinkId}/hide`;

describe(`POST ${url}`, async () => {
  const di = await bootstrap(await EnvironmentLoader.load());
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      "/api/publishing/link/id/revoke",
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("happy path", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    // @ts-expect-error
    spyOn(db, "update").mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn() }) });

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdAndRevisionHeaders() },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
  });
});
