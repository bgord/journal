import * as bg from "@bgord/bun";
import { languages } from "+languages";

type Dependencies = { UserLanguageQuery: bg.Preferences.Ports.UserLanguageQueryPort };

export function createUserLanguageOHQ(deps: Dependencies) {
  return new bg.Preferences.OHQ.UserLanguageAdapter(
    languages,
    deps.UserLanguageQuery,
    new bg.Preferences.Ports.UserLanguageResolverSystemDefaultFallback(languages),
  );
}
