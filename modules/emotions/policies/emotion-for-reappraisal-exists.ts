import * as Emotions from "+emotions";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class EmotionForReappraisalExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmotionForReappraisalExistsError.prototype);
  }
}

type EmotionForReappraisalExistsConfigType = {
  emotion?: Emotions.Entities.Emotion;
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
