import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type * as Auth from "+auth";

class RequesterOwnsWeeklyReviewError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RequesterOwnsWeeklyReviewError.prototype);
  }
}

type RequesterOwnsWeeklyReviewConfigType = { requesterId: Auth.VO.UserIdType; ownerId?: Auth.VO.UserIdType };

class RequesterOwnsWeeklyReviewFactory extends bg.Invariant<RequesterOwnsWeeklyReviewConfigType> {
  fails(config: RequesterOwnsWeeklyReviewConfigType) {
    return config.requesterId !== config.ownerId;
  }

  message = "requester.owns.weekly.review";

  error = RequesterOwnsWeeklyReviewError;

  code = 403 as ContentfulStatusCode;
}

export const RequesterOwnsWeeklyReview = new RequesterOwnsWeeklyReviewFactory();
