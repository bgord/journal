import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "+emotions";

class AlarmAlreadyGeneratedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAlreadyGeneratedError.prototype);
  }
}

type AlarmAlreadyGeneratedConfigType = { status: Emotions.VO.AlarmStatusEnum };

class AlarmAlreadyGeneratedFactory extends bg.Invariant<AlarmAlreadyGeneratedConfigType> {
  fails(config: AlarmAlreadyGeneratedConfigType) {
    return config.status !== Emotions.VO.AlarmStatusEnum.generated;
  }

  message = "alarm.already.generated";

  error = AlarmAlreadyGeneratedError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAlreadyGenerated = new AlarmAlreadyGeneratedFactory();
