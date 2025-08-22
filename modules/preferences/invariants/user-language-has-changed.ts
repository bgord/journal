import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class UserLanguageHasChangedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserLanguageHasChangedError.prototype);
  }
}

type UserLanguageHasChangedConfigType = { current: string | null; next: string };

class UserLanguageHasChangedFactory extends bg.Invariant<UserLanguageHasChangedConfigType> {
  fails(config: UserLanguageHasChangedConfigType) {
    return config.current === config.next;
  }

  message = "UserLanguageHasChanged";

  error = UserLanguageHasChangedError;

  code = 403 as ContentfulStatusCode;
}

export const UserLanguageHasChanged = new UserLanguageHasChangedFactory();
