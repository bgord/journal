import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";

class EntryHasBenStartedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryHasBenStartedError.prototype);
  }
}

type EntryHasBenStartedConfigType = { situation?: Emotions.Entities.Situation };

class EntryHasBenStartedFactory extends bg.Invariant<EntryHasBenStartedConfigType> {
  passes(config: EntryHasBenStartedConfigType) {
    if (config.situation === undefined) return false;
    return true;
  }

  message = "entry.has.been.started";
  error = EntryHasBenStartedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const EntryHasBenStarted = new EntryHasBenStartedFactory();
