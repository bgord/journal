import type { CountTodaysAlarmsForUser } from "+emotions/queries";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class DailyAlarmLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, DailyAlarmLimitError.prototype);
  }
}

type DailyAlarmLimitConfigType = Awaited<ReturnType<typeof CountTodaysAlarmsForUser.execute>>;

class DailyAlarmLimitFactory extends bg.Invariant<DailyAlarmLimitConfigType> {
  fails(config: DailyAlarmLimitConfigType) {
    return config.count >= 10;
  }

  message = "daily.alarm.limit";

  error = DailyAlarmLimitError;

  code = 403 as ContentfulStatusCode;
}

export const DailyAlarmLimit = new DailyAlarmLimitFactory();
