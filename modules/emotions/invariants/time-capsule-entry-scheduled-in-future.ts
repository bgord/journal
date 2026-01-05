import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

class TimeCapsuleEntryScheduledInFutureError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryScheduledInFutureError.prototype);
  }
}

type TimeCapsuleEntryScheduledInFutureConfigType = {
  now: tools.Timestamp;
  scheduledFor: tools.TimestampValueType;
};

class TimeCapsuleEntryScheduledInFutureFactory extends bg.Invariant<TimeCapsuleEntryScheduledInFutureConfigType> {
  fails(config: TimeCapsuleEntryScheduledInFutureConfigType) {
    return config.now.isAfterOrEqual(tools.Timestamp.fromValue(config.scheduledFor));
  }

  message = "time.capsule.entry.scheduled.in.future";
  error = TimeCapsuleEntryScheduledInFutureError;
  kind = bg.InvariantFailureKind.precondition;
}

export const TimeCapsuleEntryScheduledInFuture = new TimeCapsuleEntryScheduledInFutureFactory();
