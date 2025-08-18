import { describe, expect, test } from "bun:test";
import { SupportedLanguages } from "+languages";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/translations";

const en = Bun.file("infra/translations/en.json");
const pl = Bun.file("infra/translations/pl.json");

describe("GET /translations", () => {
  test("happy path - no language specified", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json).toEqual({ translations: await en.json(), language: "en" });
  });

  test("happy path - en", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: `language=${SupportedLanguages.en}` } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json).toEqual({ translations: await en.json(), language: "en" });
  });

  test("happy path - pl", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: `language=${SupportedLanguages.pl}` } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json).toEqual({ translations: await pl.json(), language: "pl" });
  });

  test("happy path - other", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: "language=es" } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json).toEqual({ translations: await en.json(), language: "en" });
  });
});
