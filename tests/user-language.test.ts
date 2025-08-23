import { describe, expect, spyOn, test } from "bun:test";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "+infra/adapters/preferences";
import * as mocks from "./mocks";

export const UserLanguageOHQ = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
  new Preferences.Ports.UserLanguageResolverThrowIfMissing(),
);

describe("UserLanguageOHQ", () => {
  test("happy path", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(SupportedLanguages.pl);

    const language = await UserLanguageOHQ.get(mocks.userId);
    expect(language).toEqual(SupportedLanguages.pl);
  });

  test("no language", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(null);

    expect(async () => UserLanguageOHQ.get(mocks.userId)).toThrow(
      Preferences.Ports.UserLanguagePreferenceMissingError,
    );
  });
});
