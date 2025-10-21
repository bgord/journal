import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/export-data";

describe("GET /entry/export-data", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Emotions.EntrySnapshot, "getAllForuser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Adapters.Emotions.AlarmDirectory, "listForUser").mockResolvedValue([mocks.alarm]);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("application/zip");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="export-${mocks.T0}.zip"`,
    );

    const zip = Buffer.from(await response.arrayBuffer()).toString("utf-8");

    expect(zip).toContain(`entry-export-${mocks.T0}.csv`);
    expect(zip).toContain(`alarm-export-${mocks.T0}.csv`);
  });
});
