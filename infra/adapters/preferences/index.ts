import { createUserLanguageOHQ } from "./user-language-ohq.adapter";
import { createUserLanguageQuery } from "./user-language-query.adapter";

export function createPreferencesAdapters() {
  const UserLanguageQuery = createUserLanguageQuery();

  return { UserLanguageQuery, UserLanguageOHQ: createUserLanguageOHQ({ UserLanguageQuery }) };
}
