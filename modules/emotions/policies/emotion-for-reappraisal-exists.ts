import * as bg from "@bgord/bun";

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
}

export const EmotionForReappraisalExists = new EmotionForReappraisalExistsFactory();
