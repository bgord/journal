import type * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import type * as Preferences from "+preferences";

class UserLanguageQueryAdapterDrizzle implements Preferences.Ports.UserLanguageQueryPort {
  async get(_userId: Auth.VO.UserIdType) {
    return SupportedLanguages.en;
  }
}

export const UserLanguageQueryAdapter = new UserLanguageQueryAdapterDrizzle();
