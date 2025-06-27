import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class OneEmotionPerEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneEmotionPerEntryError.prototype);
  }
}

type OneEmotionPerEntryConfigType = {
  emotion?: Emotions.Entities.Emotion;
};

class OneEmotionPerEntryFactory extends bg.Policy<OneEmotionPerEntryConfigType> {
  fails(config: OneEmotionPerEntryConfigType) {
    return config.emotion !== undefined;
  }

  message = "one.emotion.per.entry";

  error = OneEmotionPerEntryError;

  code = 400 as ContentfulStatusCode;
}

export const OneEmotionPerEntry = new OneEmotionPerEntryFactory();
