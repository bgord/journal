import * as bg from "@bgord/bun";

class WeeklyReviewExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewExistsError.prototype);
  }
}

type WeeklyReviewExistsConfigType = { weeklyReview: any | null | undefined };

class WeeklyReviewExistsFactory extends bg.Invariant<WeeklyReviewExistsConfigType> {
  fails(config: WeeklyReviewExistsConfigType) {
    return !config.weeklyReview;
  }

  message = "weekly.review.exists.error";
  error = WeeklyReviewExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WeeklyReviewExists = new WeeklyReviewExistsFactory();
