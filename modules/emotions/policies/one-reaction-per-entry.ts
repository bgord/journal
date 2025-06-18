import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as Entities from "../entities";

class OneReactionPerEmotionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneReactionPerEmotionError.prototype);
  }
}

type OneReactionPerEntryConfigType = {
  reaction?: Entities.Reaction;
};

class OneReactionPerEntryFactory extends bg.Policy<OneReactionPerEntryConfigType> {
  fails(config: OneReactionPerEntryConfigType) {
    return config.reaction !== undefined;
  }

  message = "one.reaction.per.entry";

  error = OneReactionPerEmotionError;

  code = 400 as ContentfulStatusCode;
}

export const OneReactionPerEntry = new OneReactionPerEntryFactory();
