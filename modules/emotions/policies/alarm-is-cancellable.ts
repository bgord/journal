import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmIsCancellableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmIsCancellableError.prototype);
  }
}

type AlarmIsCancellableConfigType = {
  status: VO.AlarmStatusEnum;
};

class AlarmIsCancellableFactory extends bg.Policy<AlarmIsCancellableConfigType> {
  fails(config: AlarmIsCancellableConfigType) {
    return config.status === VO.AlarmStatusEnum.notification_sent;
  }

  message = "alarm.is.cancellable";

  error = AlarmIsCancellableError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmIsCancellable = new AlarmIsCancellableFactory();
