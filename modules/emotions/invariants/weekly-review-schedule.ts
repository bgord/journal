import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

// Stryker disable all
class WeeklyReviewScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewScheduleError.prototype);
  }
}
// Stryker restore all

type WeeklyReviewScheduleConfigType = { timestamp: tools.TimestampValueType };

class WeeklyReviewScheduleFactory extends bg.Invariant<WeeklyReviewScheduleConfigType> {
  passes(config: WeeklyReviewScheduleConfigType) {
    if (!tools.Weekday.fromTimestampValue(config.timestamp).isMonday()) return false;

    const sixPM = tools.Hour.fromValue(18);
    const hour = tools.Hour.fromTimestampValue(config.timestamp);

    return hour.equals(sixPM);
  }

  // Stryker disable all
  message = "weekly.review.schedule";
  // Stryker restore all
  error = WeeklyReviewScheduleError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WeeklyReviewSchedule = new WeeklyReviewScheduleFactory();
