import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class AlarmIsCancellableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmIsCancellableError.prototype);
  }
}

type AlarmIsCancellableConfigType = {
  status: Emotions.VO.AlarmStatusEnum;
};

class AlarmIsCancellableFactory extends bg.Policy<AlarmIsCancellableConfigType> {
  fails(config: AlarmIsCancellableConfigType) {
    return config.status === Emotions.VO.AlarmStatusEnum.notification_sent;
  }

  message = "alarm.is.cancellable";

  error = AlarmIsCancellableError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmIsCancellable = new AlarmIsCancellableFactory();
