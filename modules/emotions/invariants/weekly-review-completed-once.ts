import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { WeeklyReviewStatusEnum } from "../value-objects/weekly-review-status";

class WeeklyReviewCompletedOnceError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewCompletedOnceError.prototype);
  }
}

type WeeklyReviewCompletedOnceConfigType = { status: Emotions.VO.WeeklyReviewStatusEnum };

class WeeklyReviewCompletedOnceFactory extends bg.Invariant<WeeklyReviewCompletedOnceConfigType> {
  passes(config: WeeklyReviewCompletedOnceConfigType) {
    return config.status === WeeklyReviewStatusEnum.requested;
  }

  // Stryker disable next-line StringLiteral
  message = "weekly.review.completed.once";
  error = WeeklyReviewCompletedOnceError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WeeklyReviewCompletedOnce = new WeeklyReviewCompletedOnceFactory();
