import * as bg from "@bgord/bun";
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "+languages";

type Dependencies = { UserLanguageQuery: bg.Preferences.Ports.UserLanguageQueryPort };

export function createUserLanguageOHQ(deps: Dependencies) {
  return new bg.Preferences.OHQ.UserLanguageAdapter(
    deps.UserLanguageQuery,
    new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES),
    new bg.Preferences.Ports.UserLanguageResolverSystemDefaultFallback(SupportedLanguages.en),
  );
}
