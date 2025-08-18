import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class TimeCapsuleEntryScheduledInFutureError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryScheduledInFutureError.prototype);
  }
}

type TimeCapsuleEntryScheduledInFutureConfigType = {
  now: tools.TimestampType;
  scheduledFor: tools.TimestampType;
};

class TimeCapsuleEntryScheduledInFutureFactory extends bg.Invariant<TimeCapsuleEntryScheduledInFutureConfigType> {
  fails(config: TimeCapsuleEntryScheduledInFutureConfigType) {
    return config.now >= config.scheduledFor;
  }

  message = "TimeCapsuleEntryScheduledInFuture";

  error = TimeCapsuleEntryScheduledInFutureError;

  code = 400 as ContentfulStatusCode;
}

export const TimeCapsuleEntryScheduledInFuture = new TimeCapsuleEntryScheduledInFutureFactory();
