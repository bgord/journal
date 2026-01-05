import * as bg from "@bgord/bun";
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

  message = "requester.owns.weekly.review.error";
  error = RequesterOwnsWeeklyReviewError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const RequesterOwnsWeeklyReview = new RequesterOwnsWeeklyReviewFactory();
