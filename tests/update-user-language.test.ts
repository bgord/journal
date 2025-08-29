import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/preferences/user-language/update";

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "unsupported.language", _known: true });
  });

  test("UserLanguageHasChanged", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Preferences.UserLanguageQueryAdapter, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ language: SupportedLanguages.en }) },
      mocks.ip,
    );
    expect(response.status).toEqual(200);
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.Preferences.UserLanguageQueryAdapter, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

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
