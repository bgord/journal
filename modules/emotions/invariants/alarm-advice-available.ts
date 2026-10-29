import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { AlarmStatusEnum } from "../value-objects/alarm-status";

class AlarmAdviceAvailableError extends Error {}

type AlarmAdviceAvailableConfigType = { status: Emotions.VO.AlarmStatusEnum; advice: object | undefined };
type AlarmAdviceAvailablePassedConfigType = { status: Emotions.VO.AlarmStatusEnum; advice: object };

class AlarmAdviceAvailableFactory extends bg.Invariant<
  AlarmAdviceAvailableConfigType,
  AlarmAdviceAvailablePassedConfigType
> {
  passes(config: AlarmAdviceAvailableConfigType) {
    // Stryker disable next-line ConditionalExpression: advice is always set once the status is advice_saved
    return config.status === AlarmStatusEnum.advice_saved && config.advice !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.advice.available";
  error = AlarmAdviceAvailableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmAdviceAvailable = new AlarmAdviceAvailableFactory();
