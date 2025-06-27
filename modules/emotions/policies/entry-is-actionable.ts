import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class EntryIsActionableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryIsActionableError.prototype);
  }
}

type EntryIsActionableConfigType = { status: Emotions.VO.EmotionJournalEntryStatusEnum };

class EntryIsActionableFactory extends bg.Policy<EntryIsActionableConfigType> {
  fails(config: EntryIsActionableConfigType) {
    return config.status !== Emotions.VO.EmotionJournalEntryStatusEnum.actionable;
  }

  message = "entry.is.actionable";

  error = EntryIsActionableError;

  code = 403 as ContentfulStatusCode;
}

export const EntryIsActionable = new EntryIsActionableFactory();
