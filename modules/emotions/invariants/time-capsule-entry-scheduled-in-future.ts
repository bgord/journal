import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class TimeCapsuleEntryScheduledInFutureError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryScheduledInFutureError.prototype);
  }
}

type TimeCapsuleEntryScheduledInFutureConfigType = {
  now: tools.TimestampVO;
  scheduledFor: tools.TimestampValueType;
};

class TimeCapsuleEntryScheduledInFutureFactory extends bg.Invariant<TimeCapsuleEntryScheduledInFutureConfigType> {
  fails(config: TimeCapsuleEntryScheduledInFutureConfigType) {
    return config.now.isAfterOrEqual(tools.TimestampVO.fromValue(config.scheduledFor));
  }

  message = "TimeCapsuleEntryScheduledInFuture";

  error = TimeCapsuleEntryScheduledInFutureError;

  code = 400 as ContentfulStatusCode;
}

export const TimeCapsuleEntryScheduledInFuture = new TimeCapsuleEntryScheduledInFutureFactory();
