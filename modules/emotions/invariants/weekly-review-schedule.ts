import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class WeeklyReviewScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewScheduleError.prototype);
  }
}

type WeeklyReviewScheduleConfigType = { timestamp: tools.TimestampValueType };

class WeeklyReviewScheduleFactory extends bg.Invariant<WeeklyReviewScheduleConfigType> {
  fails(config: WeeklyReviewScheduleConfigType) {
    const weekday = tools.Weekday.fromTimestampValue(config.timestamp);
    const hour = tools.Hour.fromTimestampValue(config.timestamp);

    const sixPM = tools.Hour.fromValue(18);

    return !(weekday.equals(tools.Weekday.MONDAY) && hour.equals(sixPM));
  }

  message = "WeeklyReviewSchedule";

  error = WeeklyReviewScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewSchedule = new WeeklyReviewScheduleFactory();
