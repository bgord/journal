import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class OneReactionPerEmotionJournalEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneReactionPerEmotionJournalEntryError.prototype);
  }
}

type OneReactionPerEmotionJournalEntryConfigType = {
  reaction?: Entities.Reaction;
};

class OneReactionPerEmotionJournalEntryFactory extends bg.Policy<OneReactionPerEmotionJournalEntryConfigType> {
  fails(config: OneReactionPerEmotionJournalEntryConfigType) {
    return config.reaction !== undefined;
  }

  message = "emotion.journal.entry.one_reaction.error";

  error = OneReactionPerEmotionJournalEntryError;
}

export const OneReactionPerEmotionJournalEntry = new OneReactionPerEmotionJournalEntryFactory();
