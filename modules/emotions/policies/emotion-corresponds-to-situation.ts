import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class EmotionCorrespondsToSituationError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmotionCorrespondsToSituationError.prototype);
  }
}

type EmotionCorrespondsToSituationConfigType = {
  situation?: Entities.Situation;
};

class EmotionCorrespondsToSituationFactory extends bg.Policy<EmotionCorrespondsToSituationConfigType> {
  fails(config: EmotionCorrespondsToSituationConfigType) {
    return config.situation === undefined;
  }

  message = "emotion-corresponds.to.situation.error";

  error = EmotionCorrespondsToSituationError;
}

export const EmotionCorrespondsToSituation = new EmotionCorrespondsToSituationFactory();
