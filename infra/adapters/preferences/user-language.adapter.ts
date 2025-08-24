import * as bg from "@bgord/bun";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import { UserLanguageQueryAdapter } from "./user-language-query.adapter";

/** @public */
export const UserLanguage = new bg.Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
  new bg.Preferences.Ports.UserLanguageResolverSystemDefaultFallback(SupportedLanguages.en),
);
