import * as bg from "@bgord/bun";
import * as VO from "+emotions/value-objects";

class WeeklyReviewIsCompletedError extends Error {}

type WeeklyReviewIsCompletedConfigType = { status?: VO.WeeklyReviewStatusEnum };

class WeeklyReviewIsCompletedFactory extends bg.Invariant<WeeklyReviewIsCompletedConfigType> {
  passes(config: WeeklyReviewIsCompletedConfigType) {
    return config.status === VO.WeeklyReviewStatusEnum.completed;
  }

  message = "weekly.review.is.completed.error";
  error = WeeklyReviewIsCompletedError;
  kind = bg.InvariantFailureKind.precondition;
}

export const WeeklyReviewIsCompleted = new WeeklyReviewIsCompletedFactory();
