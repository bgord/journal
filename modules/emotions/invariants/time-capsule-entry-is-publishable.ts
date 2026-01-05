import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "+emotions/value-objects";

class TimeCapsuleEntryIsPublishableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryIsPublishableError.prototype);
  }
}

type TimeCapsuleEntryIsPublishableConfigType = {
  status: VO.TimeCapsuleEntryStatusEnum;
  scheduledFor: tools.TimestampValueType;
  now: tools.Timestamp;
};

class TimeCapsuleEntryIsPublishableFactory extends bg.Invariant<TimeCapsuleEntryIsPublishableConfigType> {
  fails(config: TimeCapsuleEntryIsPublishableConfigType) {
    if (config.status !== VO.TimeCapsuleEntryStatusEnum.scheduled) return true;
    if (config.now.isBefore(tools.Timestamp.fromValue(config.scheduledFor))) return true;
    return false;
  }

  // Stryker disable all
  message = "time.capsule.entry.is.publishable";
  // Stryker restore all

  error = TimeCapsuleEntryIsPublishableError;

  code = 403 as ContentfulStatusCode;
}

export const TimeCapsuleEntryIsPublishable = new TimeCapsuleEntryIsPublishableFactory();
