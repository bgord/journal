import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/list";

describe("GET /entry/list", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path ", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.EntryRepository, "listForUser").mockResolvedValue([mocks.fullEntryFormatted]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntryFormatted]);
  });

  test("happy path - empty list", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.EntryRepository, "listForUser").mockResolvedValue([]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([]);
  });
});
