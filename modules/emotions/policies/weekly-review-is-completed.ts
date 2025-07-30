import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class WeeklyReviewIsCompletedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewIsCompletedError.prototype);
  }
}

type WeeklyReviewIsCompletedConfigType = { status?: string };

class WeeklyReviewIsCompletedFactory extends bg.Policy<WeeklyReviewIsCompletedConfigType> {
  fails(config: WeeklyReviewIsCompletedConfigType) {
    return config.status !== VO.WeeklyReviewStatusEnum.completed;
  }

  message = "weekly.review.is.completed.error";

  error = WeeklyReviewIsCompletedError;

  code = 400 as ContentfulStatusCode;
}

export const WeeklyReviewIsCompleted = new WeeklyReviewIsCompletedFactory();
