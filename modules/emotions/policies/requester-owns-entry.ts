import type * as Auth from "+auth";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class RequesterOwnsEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RequesterOwnsEntryError.prototype);
  }
}

type RequesterOwnsEntryConfigType = { requesterId: Auth.VO.UserIdType; ownerId?: Auth.VO.UserIdType };

class RequesterOwnsEntryFactory extends bg.Policy<RequesterOwnsEntryConfigType> {
  fails(config: RequesterOwnsEntryConfigType) {
    return config.requesterId !== config.ownerId;
  }

  message = "requester.owns.entry";

  error = RequesterOwnsEntryError;

  code = 403 as ContentfulStatusCode;
}

export const RequesterOwnsEntry = new RequesterOwnsEntryFactory();
