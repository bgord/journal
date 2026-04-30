import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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
  passes(config: TimeCapsuleEntryIsPublishableConfigType) {
    if (config.status !== VO.TimeCapsuleEntryStatusEnum.scheduled) return false;
    return config.now.isAfterOrEqual(tools.Timestamp.fromValue(config.scheduledFor));
  }

  // Stryker disable next-line StringLiteral
  message = "time.capsule.entry.is.publishable";
  error = TimeCapsuleEntryIsPublishableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const TimeCapsuleEntryIsPublishable = new TimeCapsuleEntryIsPublishableFactory();
