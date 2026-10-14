import * as bg from "@bgord/bun";

class WeeklyReviewExistsError extends Error {}

type WeeklyReviewExistsConfigType = { weeklyReview: object | null | undefined };
type WeeklyReviewExistsPassedConfigType = { weeklyReview: object };

class WeeklyReviewExistsFactory extends bg.Invariant<
  WeeklyReviewExistsConfigType,
  WeeklyReviewExistsPassedConfigType
> {
  passes(config: WeeklyReviewExistsConfigType) {
    return Boolean(config.weeklyReview);
  }

  message = "weekly.review.exists.error";
  error = WeeklyReviewExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const WeeklyReviewExists = new WeeklyReviewExistsFactory();
