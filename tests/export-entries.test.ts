import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/export";

describe("POST ", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.EntryRepository, "listEntriesForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toEqualIgnoringWhitespace(mocks.csv);
    // TODO
    expect(response.headers.get("content-type"));
    expect(response.headers.get("content-disposition"));
  });
});
