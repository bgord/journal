import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class InactivityAlarmScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InactivityAlarmScheduleError.prototype);
  }
}

type InactivityAlarmScheduleConfigType = { timestamp: tools.TimestampValueType };

class InactivityAlarmScheduleFactory extends bg.Invariant<InactivityAlarmScheduleConfigType> {
  fails(config: InactivityAlarmScheduleConfigType) {
    const weekday = tools.Weekday.fromUtcTimestamp(tools.TimestampVO.fromValue(config.timestamp));
    const hour = tools.Hour.fromEpochMs(tools.TimestampVO.fromValue(config.timestamp));

    const sixPM = new tools.Hour(18);

    return !(weekday.equals(tools.Weekday.WEDNESDAY) && hour.equals(sixPM));
  }

  message = "InactivityAlarmSchedule";

  error = InactivityAlarmScheduleError;

  code = 403 as ContentfulStatusCode;
}

export const InactivityAlarmSchedule = new InactivityAlarmScheduleFactory();
