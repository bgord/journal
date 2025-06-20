import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as VO from "../value-objects";

class EntryIsActionableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryIsActionableError.prototype);
  }
}

type EntryIsActionableConfigType = { status: VO.EmotionJournalEntryStatusEnum };

class EntryIsActionableFactory extends bg.Policy<EntryIsActionableConfigType> {
  fails(config: EntryIsActionableConfigType) {
    return config.status !== VO.EmotionJournalEntryStatusEnum.actionable;
  }

  message = "entry.is.actionable";

  error = EntryIsActionableError;

  code = 403 as ContentfulStatusCode;
}

export const EntryIsActionable = new EntryIsActionableFactory();
