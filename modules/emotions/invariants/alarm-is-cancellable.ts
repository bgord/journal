import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

class AlarmIsCancellableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmIsCancellableError.prototype);
  }
}

type AlarmIsCancellableConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmIsCancellableFactory extends bg.Invariant<AlarmIsCancellableConfigType> {
  passes(config: AlarmIsCancellableConfigType) {
    return config.status !== Emotions.VO.AlarmStatusEnum.cancelled;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.is.cancellable";
  error = AlarmIsCancellableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmIsCancellable = new AlarmIsCancellableFactory();
