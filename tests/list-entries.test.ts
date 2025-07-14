import { describe, expect, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/list";

describe("GET /entry/list", () => {
  test("happy path ", async () => {
    spyOn(Emotions.Repos.EntryRepository, "list").mockResolvedValue([mocks.fullEntryFormatted]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([mocks.fullEntryFormatted]);
  });

  test("happy path - empty list", async () => {
    spyOn(Emotions.Repos.EntryRepository, "list").mockResolvedValue([]);
    const response = await server.request(url, { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([]);
  });
});
