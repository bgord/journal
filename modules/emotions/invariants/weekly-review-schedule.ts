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
    const now = tools.TimestampVO.fromValue(config.timestamp);
    const weekday = tools.Weekday.fromUtcTimestamp(now);
    const hour = tools.Hour.fromEpochMs(now);

    const sixPM = new tools.Hour(18);

    return !(weekday.equals(tools.Weekday.MONDAY) && hour.equals(sixPM));
  }

  message = "WeeklyReviewSchedule";

  error = WeeklyReviewScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewSchedule = new WeeklyReviewScheduleFactory();
