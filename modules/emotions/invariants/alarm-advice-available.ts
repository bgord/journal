import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type * as AI from "+ai";
import * as Emotions from "+emotions";

class AlarmAdviceAvailableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAdviceAvailableError.prototype);
  }
}

type AlarmAdviceAvailableConfigType = {
  advice?: AI.Advice;
  status: Emotions.VO.AlarmStatusEnum;
};

class AlarmAdviceAvailableFactory extends bg.Invariant<AlarmAdviceAvailableConfigType> {
  fails(config: AlarmAdviceAvailableConfigType) {
    return !config.advice?.get() || config.status !== Emotions.VO.AlarmStatusEnum.advice_saved;
  }

  message = "alarm.advice.available";

  error = AlarmAdviceAvailableError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
