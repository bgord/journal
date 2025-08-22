import { describe, expect, spyOn, test } from "bun:test";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "+infra/adapters/preferences";
import * as mocks from "./mocks";

export const UserLanguageOHQ = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
);

describe("UserLanguageOHQ", () => {
  test("happy path", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(
      Preferences.VO.LanguageTag.create(SupportedLanguages.en),
    );

    const language = await UserLanguageOHQ.get(mocks.userId);
    expect(language).toEqual(SupportedLanguages.en);
  });

  test("no language", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(null);

    expect(async () => UserLanguageOHQ.get(mocks.userId)).toThrow(
      Preferences.OHQ.UserLanguagePreferenceMissingError,
    );
  });
});
