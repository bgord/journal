import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export interface UserLanguageQueryPort {
  get(userId: Auth.VO.UserIdType): Promise<tools.LanguageType | null>;
}
