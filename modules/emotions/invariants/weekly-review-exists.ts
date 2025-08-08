import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class WeeklyReviewExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewExistsError.prototype);
  }
}

type WeeklyReviewExistsConfigType = { weeklyReview?: Schema.SelectWeeklyReviews };

class WeeklyReviewExistsFactory extends bg.Invariant<WeeklyReviewExistsConfigType> {
  fails(config: WeeklyReviewExistsConfigType) {
    return config.weeklyReview === undefined;
  }

  message = "weekly.review.exists.error";

  error = WeeklyReviewExistsError;

  code = 404 as ContentfulStatusCode;
}

export const WeeklyReviewExists = new WeeklyReviewExistsFactory();
