import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type * as VO from "+preferences/value-objects";

class UserLanguageHasChangedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserLanguageHasChangedError.prototype);
  }
}

type UserLanguageHasChangedConfigType = { current?: VO.LanguageTag | null; candidate: VO.LanguageTag };

class UserLanguageHasChangedFactory extends bg.Invariant<UserLanguageHasChangedConfigType> {
  fails(config: UserLanguageHasChangedConfigType) {
    if (!config.current) return false;
    return config.current.equals(config.candidate);
  }

  message = "UserLanguageHasChanged";

  error = UserLanguageHasChangedError;

  code = 403 as ContentfulStatusCode;
}

export const UserLanguageHasChanged = new UserLanguageHasChangedFactory();
