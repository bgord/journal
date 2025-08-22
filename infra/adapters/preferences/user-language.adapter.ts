import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "./user-language-query.adapter";

export const UserLanguageAdapter = new Preferences.OHQ.UserLanguageAdapter(
  UserLanguageQueryAdapter,
  new Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
);

(async function main() {
  const language = await UserLanguageAdapter.get("some_id");

  const templates: Record<SupportedLanguages, string> = {
    [SupportedLanguages.en]: "EN",
    [SupportedLanguages.pl]: "PL",
  };

  const template = templates[language];
  console.log(template);
})();
