import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

// Stryker disable all
class InactivityAlarmScheduleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InactivityAlarmScheduleError.prototype);
  }
}
// Stryker restore all

type InactivityAlarmScheduleConfigType = { timestamp: tools.TimestampValueType };

class InactivityAlarmScheduleFactory extends bg.Invariant<InactivityAlarmScheduleConfigType> {
  fails(config: InactivityAlarmScheduleConfigType) {
    if (!tools.Weekday.fromTimestampValue(config.timestamp).isWednesday()) return true;

    const sixPM = tools.Hour.fromValue(18);
    const hour = tools.Hour.fromTimestampValue(config.timestamp);

    return !hour.equals(sixPM);
  }

  // Stryker disable all
  message = "inactivity.alarm.schedule";
  // Stryker restore all
  error = InactivityAlarmScheduleError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const InactivityAlarmSchedule = new InactivityAlarmScheduleFactory();
