import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

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
  fails(config: WeeklyReviewScheduleConfigType) {
    if (!tools.Weekday.fromTimestampValue(config.timestamp).isMonday()) return true;

    const sixPM = tools.Hour.fromValue(18);
    const hour = tools.Hour.fromTimestampValue(config.timestamp);

    return !hour.equals(sixPM);
  }

  // Stryker disable all
  message = "WeeklyReviewSchedule";
  // Stryker restore all

  error = WeeklyReviewScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewSchedule = new WeeklyReviewScheduleFactory();
