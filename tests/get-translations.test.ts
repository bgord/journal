import { describe, expect, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { SupportedLanguages } from "../modules/supported-languages";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/translations";

const en = Bun.file("infra/translations/en.json");
const pl = Bun.file("infra/translations/pl.json");

describe(`GET ${url}`, async () => {
  const di = await bootstrap(mocks.Env);
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("happy path - no language specified", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json).toEqual({
      translations: await en.json(),
      language: "en",
      supportedLanguages: SupportedLanguages,
    });
  });

  test("happy path - en", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: `language=${SupportedLanguages.en}` } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json).toEqual({
      translations: await en.json(),
      language: "en",
      supportedLanguages: SupportedLanguages,
    });
  });

  test("happy path - pl", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: `language=${SupportedLanguages.pl}` } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json).toEqual({
      translations: await pl.json(),
      language: "pl",
      supportedLanguages: SupportedLanguages,
    });
  });

  test("happy path - other", async () => {
    const response = await server.request(
      url,
      { method: "GET", headers: { cookie: "language=es" } },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(200);
    expect(json).toEqual({
      translations: await en.json(),
      language: "en",
      supportedLanguages: SupportedLanguages,
    });
  });
});
