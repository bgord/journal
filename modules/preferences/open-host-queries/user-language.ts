import type * as Auth from "+auth";
import type { SupportedLanguages } from "+languages";
import type * as Preferences from "+preferences";

export class UserLanguagePreferenceMissingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserLanguagePreferenceMissingError.prototype);
  }
}

export interface UserLanguagePort {
  get(userId: Auth.VO.UserIdType): Promise<SupportedLanguages>;
}

export class UserLanguageAdapter implements UserLanguagePort {
  constructor(private readonly query: Preferences.Ports.UserLanguageQueryPort) {}

  async get(userId: Auth.VO.UserIdType): Promise<SupportedLanguages> {
    const language = await this.query.get(userId);

    if (!language) throw new UserLanguagePreferenceMissingError();

    return language;
  }
}
