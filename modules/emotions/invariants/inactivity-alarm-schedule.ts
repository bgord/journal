import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class InactivityAlarmScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InactivityAlarmScheduleError.prototype);
  }
}

type InactivityAlarmScheduleConfigType = { timestamp: tools.TimestampType };

class InactivityAlarmScheduleFactory extends bg.Invariant<InactivityAlarmScheduleConfigType> {
  fails(config: InactivityAlarmScheduleConfigType) {
    const date = new Date(config.timestamp);

    return !(date.getUTCDay() === bg.UTC_DAY_OF_THE_WEEK.Wednesday && date.getUTCHours() === 18);
  }

  message = "InactivityAlarmSchedule";

  error = InactivityAlarmScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const InactivityAlarmSchedule = new InactivityAlarmScheduleFactory();
