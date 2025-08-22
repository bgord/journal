import type * as Auth from "+auth";
import type { SupportedLanguages } from "+languages";

export interface UserLanguagePort {
  get(userId: Auth.VO.UserIdType): Promise<SupportedLanguages | null>;
}
