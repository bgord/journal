import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class OneSituationPerEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneSituationPerEntryError.prototype);
  }
}

type OneSituationPerEntryConfigType = {
  situation?: Entities.Situation;
};

class OneSituationPerEntryFactory extends bg.Policy<OneSituationPerEntryConfigType> {
  fails(config: OneSituationPerEntryConfigType) {
    return config.situation !== undefined;
  }

  message = "one.reaction.per.entry";

  error = OneSituationPerEntryError;
}

export const OneSituationPerEntry = new OneSituationPerEntryFactory();
