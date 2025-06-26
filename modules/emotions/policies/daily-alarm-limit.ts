import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class DailyAlarmLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, DailyAlarmLimitError.prototype);
  }
}

type DailyAlarmLimitConfigType = {
  count: number;
};

class DailyAlarmLimitFactory extends bg.Policy<DailyAlarmLimitConfigType> {
  fails(config: DailyAlarmLimitConfigType) {
    return config.count >= 5;
  }

  message = "daily.alarm.limit";

  error = DailyAlarmLimitError;

  code = 403 as ContentfulStatusCode;
}

export const DailyAlarmLimit = new DailyAlarmLimitFactory();
