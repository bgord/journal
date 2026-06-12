import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { EntryStatusEnum } from "../value-objects/entry-status";

class EntryIsActionableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryIsActionableError.prototype);
  }
}

type EntryIsActionableConfigType = { status: Emotions.VO.EntryStatusEnum };

class EntryIsActionableFactory extends bg.Invariant<EntryIsActionableConfigType> {
  passes(config: EntryIsActionableConfigType) {
    return config.status === EntryStatusEnum.actionable;
  }

  message = "entry.is.actionable.error";
  error = EntryIsActionableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const EntryIsActionable = new EntryIsActionableFactory();
