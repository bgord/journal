import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class ReactionCorrespondsToSituationAndEmotionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ReactionCorrespondsToSituationAndEmotionError.prototype);
  }
}

type ReactionCorrespondsToSituationAndEmotionConfigType = {
  situation?: Entities.Situation;
  emotion?: Entities.Emotion;
};

class ReactionCorrespondsToSituationAndEmotionFactory extends bg.Policy<ReactionCorrespondsToSituationAndEmotionConfigType> {
  fails(config: ReactionCorrespondsToSituationAndEmotionConfigType) {
    return config.situation === undefined || config.emotion === undefined;
  }

  message = "reaction.corresponds.to.situation.and.emotion.error";

  error = ReactionCorrespondsToSituationAndEmotionError;
}

export const ReactionCorrespondsToSituationAndEmotion = new ReactionCorrespondsToSituationAndEmotionFactory();
