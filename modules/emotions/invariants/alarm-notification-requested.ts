import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "+emotions";

class AlarmNotificationRequestedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmNotificationRequestedError.prototype);
  }
}

type AlarmNotificationRequestedConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmNotificationRequestedFactory extends bg.Invariant<AlarmNotificationRequestedConfigType> {
  fails(config: AlarmNotificationRequestedConfigType) {
    return config.status !== Emotions.VO.AlarmStatusEnum.notification_requested;
  }

  // Stryker disable all
  message = "alarm.notification.requested";
  // Stryker restore all

  error = AlarmNotificationRequestedError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmNotificationRequested = new AlarmNotificationRequestedFactory();
