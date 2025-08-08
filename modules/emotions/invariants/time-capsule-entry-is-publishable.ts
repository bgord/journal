import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class TimeCapsuleEntryIsPublishableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryIsPublishableError.prototype);
  }
}

type TimeCapsuleEntryIsPublishableConfigType = {
  status: string;
  scheduledFor: tools.TimestampType;
  now: tools.TimestampType;
};

class TimeCapsuleEntryIsPublishableFactory extends bg.Invariant<TimeCapsuleEntryIsPublishableConfigType> {
  fails(config: TimeCapsuleEntryIsPublishableConfigType) {
    if (config.status !== VO.TimeCapsuleEntryStatusEnum.scheduled) return true;
    if (config.now < config.scheduledFor) return true;
    return false;
  }

  message = "TimeCapsuleEntryIsPublishable";

  error = TimeCapsuleEntryIsPublishableError;

  code = 403 as ContentfulStatusCode;
}

export const TimeCapsuleEntryIsPublishable = new TimeCapsuleEntryIsPublishableFactory();
