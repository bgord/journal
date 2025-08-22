import type * as Auth from "+auth";
import type * as Preferences from "+preferences";

export interface UserLanguageQueryPort {
  get(userId: Auth.VO.UserIdType): Promise<Preferences.VO.LanguageTag | null>;
}
