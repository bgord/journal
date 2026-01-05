import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";

class EmotionCorrespondsToSituationError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmotionCorrespondsToSituationError.prototype);
  }
}

type EmotionCorrespondsToSituationConfigType = { situation?: Emotions.Entities.Situation };

class EmotionCorrespondsToSituationFactory extends bg.Invariant<EmotionCorrespondsToSituationConfigType> {
  fails(config: EmotionCorrespondsToSituationConfigType) {
    return config.situation === undefined;
  }

  message = "emotion.corresponds.to.situation.error";
  error = EmotionCorrespondsToSituationError;
  kind = bg.InvariantFailureKind.precondition;
}

export const EmotionCorrespondsToSituation = new EmotionCorrespondsToSituationFactory();
