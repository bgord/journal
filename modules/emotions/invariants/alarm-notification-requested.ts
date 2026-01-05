import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

class AlarmNotificationRequestedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmNotificationRequestedError.prototype);
  }
}

type AlarmNotificationRequestedConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmNotificationRequestedFactory extends bg.Invariant<AlarmNotificationRequestedConfigType> {
  passes(config: AlarmNotificationRequestedConfigType) {
    return config.status === Emotions.VO.AlarmStatusEnum.notification_requested;
  }

  // Stryker disable all
  message = "alarm.notification.requested";
  // Stryker restore all
  error = AlarmNotificationRequestedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmNotificationRequested = new AlarmNotificationRequestedFactory();
