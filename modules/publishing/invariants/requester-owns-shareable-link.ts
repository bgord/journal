import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type * as Auth from "+auth";

class RequesterOwnsShareableLinkError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RequesterOwnsShareableLinkError.prototype);
  }
}

type RequesterOwnsShareableLinkConfigType = { requesterId: Auth.VO.UserIdType; ownerId?: Auth.VO.UserIdType };

class RequesterOwnsShareableLinkFactory extends bg.Invariant<RequesterOwnsShareableLinkConfigType> {
  fails(config: RequesterOwnsShareableLinkConfigType) {
    return config.requesterId !== config.ownerId;
  }

  message = "requester.owns.shareable.link";

  error = RequesterOwnsShareableLinkError;

  code = 403 as ContentfulStatusCode;
}

export const RequesterOwnsShareableLink = new RequesterOwnsShareableLinkFactory();
