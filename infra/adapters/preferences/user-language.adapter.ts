import type * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import type * as Preferences from "+preferences";

class UserLanguageAdapterDrizzle implements Preferences.Ports.UserLanguagePort {
  async get(_userId: Auth.VO.UserIdType) {
    return SupportedLanguages.en;
  }
}

export const UserLanguageAdapter = new UserLanguageAdapterDrizzle();
