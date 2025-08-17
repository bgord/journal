import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { EntrySnapshot } from "+infra/adapters/emotions";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/export";

describe("GET /entry/export ", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getAllForuser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.AlarmRepository, "listForUser").mockResolvedValue([mocks.alarm]);
    spyOn(Date, "now").mockReturnValue(1000);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("application/zip");
    expect(response.headers.get("content-disposition")).toEqual(`attachment; filename="export-1000.zip"`);

    const zip = Buffer.from(await response.arrayBuffer()).toString("utf-8");

    expect(zip).toContain("entry-export-1000.csv");
    expect(zip).toContain("alarm-export-1000.csv");
  });
});
