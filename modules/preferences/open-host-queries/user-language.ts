import type * as Auth from "+auth";
import type * as Preferences from "+preferences";

export interface UserLanguagePort<L extends readonly string[]> {
  get(userId: Auth.VO.UserIdType): Promise<L[number]>;
}

export class UserLanguageAdapter<L extends readonly string[]> implements UserLanguagePort<L> {
  constructor(
    private readonly query: Preferences.Ports.UserLanguageQueryPort,
    private readonly validator: Preferences.VO.SupportedLanguagesSet<L>,
    private readonly resolver: Preferences.Ports.UserLanguageResolverPort,
  ) {}

  async get(userId: Auth.VO.UserIdType): Promise<L[number]> {
    const stored = await this.query.get(userId);
    const candidate = await this.resolver.resolve(stored);

    return this.validator.ensure(candidate);
  }
}
