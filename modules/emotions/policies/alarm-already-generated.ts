import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "../value-objects";

class AlarmAlreadyGeneratedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AlarmAlreadyGeneratedError.prototype);
  }
}

type AlarmAlreadyGeneratedConfigType = {
  status: VO.AlarmStatusEnum;
};

class AlarmAlreadyGeneratedFactory extends bg.Policy<AlarmAlreadyGeneratedConfigType> {
  fails(config: AlarmAlreadyGeneratedConfigType) {
    return config.status !== VO.AlarmStatusEnum.generated;
  }

  message = "alarm.already.generated";

  error = AlarmAlreadyGeneratedError;

  code = 403 as ContentfulStatusCode;
}

export const AlarmAlreadyGenerated = new AlarmAlreadyGeneratedFactory();
