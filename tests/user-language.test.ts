import { describe, expect, spyOn, test } from "bun:test";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "+infra/adapters/preferences";
import * as mocks from "./mocks";

describe("UserLanguageOHQ", () => {
  test("happy path", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(SupportedLanguages.pl);

    const UserLanguageOHQ = new Preferences.OHQ.UserLanguageAdapter(
      UserLanguageQueryAdapter,
      new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
      new Preferences.Ports.UserLanguageResolverThrowIfMissing(),
    );

    const language = await UserLanguageOHQ.get(mocks.userId);
    expect(language).toEqual(SupportedLanguages.pl);
  });

  test("UserLanguageResolverThrowIfMissing", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(null);

    const UserLanguageOHQ = new Preferences.OHQ.UserLanguageAdapter(
      UserLanguageQueryAdapter,
      new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
      new Preferences.Ports.UserLanguageResolverThrowIfMissing(),
    );

    expect(async () => UserLanguageOHQ.get(mocks.userId)).toThrow(
      Preferences.Ports.UserLanguagePreferenceMissingError,
    );
  });

  test("UserLanguageResolverThrowIfMissing", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(null);

    const UserLanguageOHQ = new Preferences.OHQ.UserLanguageAdapter(
      UserLanguageQueryAdapter,
      new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
      new Preferences.Ports.UserLanguageResolverSystemDefaultFallback(SupportedLanguages.en),
    );

    const result = await UserLanguageOHQ.get(mocks.userId);
    expect(result).toEqual(SupportedLanguages.en);
  });
});
