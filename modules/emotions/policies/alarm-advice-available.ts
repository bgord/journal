import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class AlarmAdviceAvailableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAdviceAvailableError.prototype);
  }
}

type AlarmAdviceAvailableConfigType = {
  advice?: Emotions.VO.EmotionalAdvice;
  status: Emotions.VO.AlarmStatusEnum;
};

class AlarmAdviceAvailableFactory extends bg.Policy<AlarmAdviceAvailableConfigType> {
  fails(config: AlarmAdviceAvailableConfigType) {
    return !config.advice?.get() || config.status !== Emotions.VO.AlarmStatusEnum.advice_saved;
  }

  message = "alarm.advice.available";

  error = AlarmAdviceAvailableError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
