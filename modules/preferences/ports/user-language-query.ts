import type * as Auth from "+auth";

export interface UserLanguageQueryPort {
  get(userId: Auth.VO.UserIdType): Promise<string | null>;
}
