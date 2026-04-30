import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

class AlarmAlreadyGeneratedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAlreadyGeneratedError.prototype);
  }
}

type AlarmAlreadyGeneratedConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmAlreadyGeneratedFactory extends bg.Invariant<AlarmAlreadyGeneratedConfigType> {
  passes(config: AlarmAlreadyGeneratedConfigType) {
    return config.status === Emotions.VO.AlarmStatusEnum.generated;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.already.generated";
  error = AlarmAlreadyGeneratedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const AlarmAlreadyGenerated = new AlarmAlreadyGeneratedFactory();
