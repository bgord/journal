import * as bg from "@bgord/bun";
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
  passes(config: AlarmAdviceAvailableConfigType) {
    if (!config.advice?.get()) return false;
    return config.status === Emotions.VO.AlarmStatusEnum.advice_saved;
  }

  // Stryker disable all
  message = "alarm.advice.available";
  // Stryker restore all
  error = AlarmAdviceAvailableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
