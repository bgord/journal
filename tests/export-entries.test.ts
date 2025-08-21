import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EntrySnapshot } from "+infra/adapters/emotions";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/entry/export-entries";

describe("GET /entry/export-entries ", () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - dateRangeStart", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(`${url}?dateRangeStart=2025-01-01`, { method: "GET" }, mocks.ip);
    expect(response.status).toBe(400);
  });

  test("validation - dateRangeStart after dateRangeEnd", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      `${url}?dateRangeStart=2025-02-01&dateRangeEnd=2025-01-01`,
      { method: "GET" },
      mocks.ip,
    );
    expect(response.status).toBe(400);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Date, "now").mockReturnValue(1000);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("text/csv");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-1000.csv"`,
    );
  });
});
