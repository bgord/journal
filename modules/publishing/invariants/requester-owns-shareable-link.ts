import type * as Auth from "+auth";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class RequesterOwnsShareableLinkError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RequesterOwnsShareableLinkError.prototype);
  }
}

type RequesterOwnsShareableLinkConfigType = { requesterId: Auth.VO.UserIdType; ownerId?: Auth.VO.UserIdType };

class RequesterOwnsShareableLinkFactory extends bg.Policy<RequesterOwnsShareableLinkConfigType> {
  fails(config: RequesterOwnsShareableLinkConfigType) {
    return config.requesterId !== config.ownerId;
  }

  message = "RequesterOwnsShareableLink";

  error = RequesterOwnsShareableLinkError;

  code = 403 as ContentfulStatusCode;
}

export const RequesterOwnsShareableLink = new RequesterOwnsShareableLinkFactory();
