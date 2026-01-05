import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as VO from "+emotions/value-objects";

// Stryker disable all
class TimeCapsuleEntryIsPublishableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TimeCapsuleEntryIsPublishableError.prototype);
  }
}
// Stryker restore all

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
  kind = bg.InvariantFailureKind.forbidden;
}

export const TimeCapsuleEntryIsPublishable = new TimeCapsuleEntryIsPublishableFactory();
