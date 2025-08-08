import * as Emotions from "+emotions";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class WeeklyReviewCompletedOnceError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewCompletedOnceError.prototype);
  }
}

type WeeklyReviewCompletedOnceConfigType = { status: Emotions.VO.WeeklyReviewStatusEnum };

class WeeklyReviewCompletedOnceFactory extends bg.Invariant<WeeklyReviewCompletedOnceConfigType> {
  fails(config: WeeklyReviewCompletedOnceConfigType) {
    return config.status !== Emotions.VO.WeeklyReviewStatusEnum.requested;
  }

  message = "weekly-review.completed.once";

  error = WeeklyReviewCompletedOnceError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewCompletedOnce = new WeeklyReviewCompletedOnceFactory();
