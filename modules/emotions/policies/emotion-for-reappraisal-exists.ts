import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as Entities from "../entities";

class EmotionForReappraisalExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmotionForReappraisalExistsError.prototype);
  }
}

type EmotionForReappraisalExistsConfigType = {
  emotion?: Entities.Emotion;
};

class EmotionForReappraisalExistsFactory extends bg.Policy<EmotionForReappraisalExistsConfigType> {
  fails(config: EmotionForReappraisalExistsConfigType) {
    return config.emotion === undefined;
  }

  message = "emotion.for.reappraisal.exists.error";

  error = EmotionForReappraisalExistsError;

  code = 400 as ContentfulStatusCode;
}

export const EmotionForReappraisalExists = new EmotionForReappraisalExistsFactory();
