import type * as Auth from "+auth";
import type { SupportedLanguages } from "+languages";

export interface UserLanguageQueryPort {
  get(userId: Auth.VO.UserIdType): Promise<SupportedLanguages | null>;
}
