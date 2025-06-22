import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmGeneratedOnceError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmGeneratedOnceError.prototype);
  }
}

type AlarmGeneratedOnceConfigType = {
  status: VO.AlarmStatusEnum;
};

class AlarmGeneratedOnceFactory extends bg.Policy<AlarmGeneratedOnceConfigType> {
  fails(config: AlarmGeneratedOnceConfigType) {
    return config.status !== VO.AlarmStatusEnum.started;
  }

  message = "alarm.generated.once";

  error = AlarmGeneratedOnceError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmGeneratedOnce = new AlarmGeneratedOnceFactory();
