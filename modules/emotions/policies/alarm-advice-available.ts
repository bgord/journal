import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmAdviceAvailableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAdviceAvailableError.prototype);
  }
}

type AlarmAdviceAvailableConfigType = {
  advice?: VO.EmotionalAdvice;
  status: VO.AlarmStatusEnum;
};

class AlarmAdviceAvailableFactory extends bg.Policy<AlarmAdviceAvailableConfigType> {
  fails(config: AlarmAdviceAvailableConfigType) {
    return !config.advice?.get() || config.status !== VO.AlarmStatusEnum.advice_saved;
  }

  message = "alarm.advice.available";

  error = AlarmAdviceAvailableError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
