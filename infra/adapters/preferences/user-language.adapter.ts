import { SUPPORTED_LANGUAGES } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "./user-language-query.adapter";

export const UserLanguage = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
);
