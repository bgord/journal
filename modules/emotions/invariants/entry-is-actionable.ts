import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

class EntryIsActionableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryIsActionableError.prototype);
  }
}

type EntryIsActionableConfigType = { status: Emotions.VO.EntryStatusEnum };

class EntryIsActionableFactory extends bg.Invariant<EntryIsActionableConfigType> {
  fails(config: EntryIsActionableConfigType) {
    return config.status !== Emotions.VO.EntryStatusEnum.actionable;
  }

  message = "entry.is.actionable.error";
  error = EntryIsActionableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const EntryIsActionable = new EntryIsActionableFactory();
