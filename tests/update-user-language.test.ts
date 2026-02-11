import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/preferences/user-language/update";

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: JSON.stringify({}) }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "unsupported.language", _known: true });
  });

  test("UserLanguageHasChanged", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(SupportedLanguages.en),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ language: SupportedLanguages.en }) },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(SupportedLanguages.en),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ language: SupportedLanguages.pl }),
        headers: mocks.correlationIdHeaders,
      },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericUserLanguageSetPLEvent]);
  });
});
