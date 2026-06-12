import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { AlarmStatusEnum } from "../value-objects/alarm-status";

class AlarmNotificationRequestedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmNotificationRequestedError.prototype);
  }
}

type AlarmNotificationRequestedConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmNotificationRequestedFactory extends bg.Invariant<AlarmNotificationRequestedConfigType> {
  passes(config: AlarmNotificationRequestedConfigType) {
    return config.status === AlarmStatusEnum.notification_requested;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.notification.requested";
  error = AlarmNotificationRequestedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmNotificationRequested = new AlarmNotificationRequestedFactory();
