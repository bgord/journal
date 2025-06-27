import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class OneSituationPerEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneSituationPerEntryError.prototype);
  }
}

type OneSituationPerEntryConfigType = {
  situation?: Emotions.Entities.Situation;
};

class OneSituationPerEntryFactory extends bg.Policy<OneSituationPerEntryConfigType> {
  fails(config: OneSituationPerEntryConfigType) {
    return config.situation !== undefined;
  }

  message = "one.reaction.per.entry";

  error = OneSituationPerEntryError;

  code = 400 as ContentfulStatusCode;
}

export const OneSituationPerEntry = new OneSituationPerEntryFactory();
