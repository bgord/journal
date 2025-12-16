import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createEnvironmentLoader } from "+infra/env";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/entry/export-entries";

describe(`GET ${url}`, async () => {
  const EnvironmentLoader = createEnvironmentLoader();
  const di = await bootstrap(await EnvironmentLoader.load());
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - dateRangeStart", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(`${url}?dateRangeStart=2025-01-01`, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(400);
  });

  test("validation - dateRangeStart after dateRangeEnd", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(
      `${url}?dateRangeStart=2025-02-01&dateRangeEnd=2025-01-01`,
      { method: "GET" },
      mocks.ip,
    );
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "invalid.date.range", _known: true });
  });

  test("happy path - text", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("text/plain");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.txt"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryText);
  });

  test("happy path - csv", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=csv`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("text/csv");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.csv"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryCsv);
  });

  test("happy path - markdown", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=markdown`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("text/markdown");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.md"`,
    );
    expect(await response.text()).toEqualIgnoringWhitespace(mocks.entryMarkdown);
  });

  test("happy path - pdf", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByDateRangeForUser").mockResolvedValue([mocks.fullEntry]);

    const response = await server.request(
      `${url}?dateRangeStart=2025-01-01&dateRangeEnd=2025-01-02&strategy=pdf`,
      { method: "GET" },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(response.headers.get("content-type")).toEqual("application/pdf");
    expect(response.headers.get("content-disposition")).toEqual(
      `attachment; filename="entry-export-${mocks.T0}.pdf"`,
    );
  });
});
