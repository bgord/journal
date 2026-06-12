import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { AlarmStatusEnum } from "../value-objects/alarm-status";

class AlarmAdviceAvailableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAdviceAvailableError.prototype);
  }
}

type AlarmAdviceAvailableConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmAdviceAvailableFactory extends bg.Invariant<AlarmAdviceAvailableConfigType> {
  passes(config: AlarmAdviceAvailableConfigType) {
    return config.status === AlarmStatusEnum.advice_saved;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.advice.available";
  error = AlarmAdviceAvailableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
