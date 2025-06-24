import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmAlreadyGeneratedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAlreadyGeneratedError.prototype);
  }
}

type AlarmAdviceAvailableConfigType = {
  advice?: VO.EmotionalAdvice;
};

class AlarmAdviceAvailableFactory extends bg.Policy<AlarmAdviceAvailableConfigType> {
  fails(config: AlarmAdviceAvailableConfigType) {
    return !config.advice?.get();
  }

  message = "alarm.advice.available";

  error = AlarmAlreadyGeneratedError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
