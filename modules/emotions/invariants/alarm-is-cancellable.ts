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
  fails(config: AlarmIsCancellableConfigType) {
    return config.status === Emotions.VO.AlarmStatusEnum.cancelled;
  }

  // Stryker disable all
  message = "alarm.is.cancellable";
  // Stryker restore all
  error = AlarmIsCancellableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmIsCancellable = new AlarmIsCancellableFactory();
