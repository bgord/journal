import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "+emotions";

class EntryHasBenStartedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryHasBenStartedError.prototype);
  }
}

type EntryHasBenStartedConfigType = { situation?: Emotions.Entities.Situation };

class EntryHasBenStartedFactory extends bg.Invariant<EntryHasBenStartedConfigType> {
  fails(config: EntryHasBenStartedConfigType) {
    return config.situation === undefined;
  }

  message = "entry.has.been.started";

  error = EntryHasBenStartedError;

  code = 403 as ContentfulStatusCode;
}

export const EntryHasBenStarted = new EntryHasBenStartedFactory();
