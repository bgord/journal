import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";

class EntryHasBeenStartedError extends Error {}

type EntryHasBeenStartedConfigType = { situation?: Emotions.Entities.Situation };

class EntryHasBeenStartedFactory extends bg.Invariant<EntryHasBeenStartedConfigType> {
  passes(config: EntryHasBeenStartedConfigType) {
    if (config.situation === undefined) return false;
    return true;
  }

  message = "entry.has.been.started";
  error = EntryHasBeenStartedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const EntryHasBeenStarted = new EntryHasBeenStartedFactory();
