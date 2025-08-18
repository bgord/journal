import * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";

export const I18nConfig: bg.I18nConfigType = {
  supportedLanguages: SupportedLanguages,
  defaultLanguage: SupportedLanguages.en,
};

export type I18nVariables = { language: SupportedLanguages };
