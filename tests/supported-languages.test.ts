import { describe, expect, test } from "bun:test";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import { SupportedLanguagesSet, UnsupportedLanguageError } from "+preferences/value-objects";

const supportedLanguagesSet = new SupportedLanguagesSet(SUPPORTED_LANGUAGES);

describe("SupportedLanguagesSet", () => {
  test("ensures the correct language type", () => {
    expect(supportedLanguagesSet.ensure(SupportedLanguages.en)).toEqual(SupportedLanguages.en);
  });

  test("throws on incorrect language", () => {
    expect(() => supportedLanguagesSet.ensure("de")).toThrow(UnsupportedLanguageError);
  });
});
