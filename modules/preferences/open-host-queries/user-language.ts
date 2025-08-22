import type * as Auth from "+auth";
import type * as Preferences from "+preferences";
import type { SupportedLanguagesSet } from "../value-objects/supported-languages";

/** @public */
export class UserLanguagePreferenceMissingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserLanguagePreferenceMissingError.prototype);
  }
}

export interface UserLanguagePort<L extends readonly string[]> {
  get(userId: Auth.VO.UserIdType): Promise<L[number]>;
}

export class UserLanguageAdapter<L extends readonly string[]> implements UserLanguagePort<L> {
  constructor(
    private readonly query: Preferences.Ports.UserLanguageQueryPort,
    private readonly validator: SupportedLanguagesSet<L>,
  ) {}

  async get(userId: Auth.VO.UserIdType): Promise<L[number]> {
    const candidate = await this.query.get(userId);

    if (!candidate) throw new UserLanguagePreferenceMissingError();

    return this.validator.ensure(candidate);
  }
}
