import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class WeeklyReviewScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewScheduleError.prototype);
  }
}

type WeeklyReviewScheduleConfigType = { timestamp: tools.TimestampType };

class WeeklyReviewScheduleFactory extends bg.Policy<WeeklyReviewScheduleConfigType> {
  fails(config: WeeklyReviewScheduleConfigType) {
    const date = new Date(config.timestamp);

    const isMondayUtc = date.getUTCDay() === bg.UTC_DAY_OF_THE_WEEK.Monday;
    const isHour18Utc = date.getUTCHours() === 18;

    return !(isMondayUtc && isHour18Utc);
  }

  message = "WeeklyReviewSchedule";

  error = WeeklyReviewScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewSchedule = new WeeklyReviewScheduleFactory();
