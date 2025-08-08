import * as Emotions from "+emotions";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class ReactionCorrespondsToSituationAndEmotionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ReactionCorrespondsToSituationAndEmotionError.prototype);
  }
}

type ReactionCorrespondsToSituationAndEmotionConfigType = {
  situation?: Emotions.Entities.Situation;
  emotion?: Emotions.Entities.Emotion;
};

class ReactionCorrespondsToSituationAndEmotionFactory extends bg.Invariant<ReactionCorrespondsToSituationAndEmotionConfigType> {
  fails(config: ReactionCorrespondsToSituationAndEmotionConfigType) {
    return config.situation === undefined || config.emotion === undefined;
  }

  message = "reaction.corresponds.to.situation.and.emotion.error";

  error = ReactionCorrespondsToSituationAndEmotionError;

  code = 400 as ContentfulStatusCode;
}

export const ReactionCorrespondsToSituationAndEmotion = new ReactionCorrespondsToSituationAndEmotionFactory();
