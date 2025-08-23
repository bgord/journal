import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "./user-language-query.adapter";

/** @public */
export const UserLanguage = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
  new Preferences.Ports.UserLanguageResolverSystemDefaultFallback(SupportedLanguages.en),
);
