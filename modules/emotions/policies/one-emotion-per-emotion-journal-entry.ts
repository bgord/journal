import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class OneEmotionPerEmotionJournalEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneEmotionPerEmotionJournalEntryError.prototype);
  }
}

type OneEmotionPerEmotionJournalEntryConfigType = {
  emotion?: Entities.Emotion;
};

class OneEmotionPerEmotionJournalEntryFactory extends bg.Policy<OneEmotionPerEmotionJournalEntryConfigType> {
  fails(config: OneEmotionPerEmotionJournalEntryConfigType) {
    return config.emotion !== undefined;
  }

  message = "emotion.journal.entry.one_emotion.error";

  error = OneEmotionPerEmotionJournalEntryError;
}

export const OneEmotionPerEmotionJournalEntry = new OneEmotionPerEmotionJournalEntryFactory();
