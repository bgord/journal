import { createUserLanguageOHQ } from "./user-language-ohq.adapter";
import { UserLanguageQuery } from "./user-language-query.adapter";

export function createPreferencesAdapters() {
  return { UserLanguageQuery, UserLanguageOHQ: createUserLanguageOHQ({ UserLanguageQuery }) };
}
