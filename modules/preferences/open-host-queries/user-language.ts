import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Preferences from "+preferences";

export class UserLanguagePreferenceMissingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserLanguagePreferenceMissingError.prototype);
  }
}

export interface UserLanguagePort<L extends tools.LanguageType[]> {
  get(userId: Auth.VO.UserIdType): Promise<L[number]>;
}

export class UserLanguageAdapter<L extends tools.LanguageType[]>
  implements UserLanguagePort<tools.LanguageType[]>
{
  constructor(private readonly query: Preferences.Ports.UserLanguageQueryPort) {}

  async get(userId: Auth.VO.UserIdType): Promise<L[number]> {
    const language = await this.query.get(userId);

    if (!language) throw new UserLanguagePreferenceMissingError();

    return tools.Language.parse(language);
  }
}
