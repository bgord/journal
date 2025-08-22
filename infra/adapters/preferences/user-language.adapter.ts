import { SUPPORTED_LANGUAGES } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "./user-language-query.adapter";

export const UserLanguageAdapter = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  SUPPORTED_LANGUAGES,
);
