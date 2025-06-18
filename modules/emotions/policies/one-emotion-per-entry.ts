import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class OneEmotionPerEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneEmotionPerEntryError.prototype);
  }
}

type OneEmotionPerEntryConfigType = {
  emotion?: Entities.Emotion;
};

class OneEmotionPerEntryFactory extends bg.Policy<OneEmotionPerEntryConfigType> {
  fails(config: OneEmotionPerEntryConfigType) {
    return config.emotion !== undefined;
  }

  message = "one.emotion.per.entry";

  error = OneEmotionPerEntryError;
}

export const OneEmotionPerEntry = new OneEmotionPerEntryFactory();
