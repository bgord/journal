import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmIdempotenceError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmIdempotenceError.prototype);
  }
}

type AlarmIdempotenceConfigType = {
  status: VO.AlarmStatusEnum;
};

class AlarmIdempotenceFactory extends bg.Policy<AlarmIdempotenceConfigType> {
  fails(config: AlarmIdempotenceConfigType) {
    return config.status !== VO.AlarmStatusEnum.started;
  }

  message = "alarm.idempotence";

  error = AlarmIdempotenceError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmIdempotence = new AlarmIdempotenceFactory();
