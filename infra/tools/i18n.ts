import type * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";

export const I18n: bg.I18nConfigType = {
  supportedLanguages: SupportedLanguages,
  defaultLanguage: SupportedLanguages.en,
};

export type I18nVariables = { language: SupportedLanguages };
