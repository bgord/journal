import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EntrySnapshot } from "+infra/adapters/emotions";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/export-entries";

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
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "invalid.date.range", _known: true });
  });

  test("happy path - csv", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("text/csv");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.csv"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryCsv);
  });

  test("happy path - text", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=text`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("text/plain");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.txt"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryText);
  });

  test("happy path - markdown", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=markdown`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("text/markdown");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.md"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryMarkdown);
  });

  test("happy path - pdf", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=pdf`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toEqual("application/pdf");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.pdf"`,
    );
  });
});
