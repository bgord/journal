import * as bg from "@bgord/bun";

import * as Entities from "../entities";

class OneSituationPerEmotionJournalEntryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, OneSituationPerEmotionJournalEntryError.prototype);
  }
}

type OneSituationPerEmotionJournalEntryConfigType = {
  situation?: Entities.Situation;
};

class OneSituationPerEmotionJournalEntryFactory extends bg.Policy<OneSituationPerEmotionJournalEntryConfigType> {
  fails(config: OneSituationPerEmotionJournalEntryConfigType) {
    return config.situation !== undefined;
  }

  message = "emotion.journal.entry.one_situation.error";

  error = OneSituationPerEmotionJournalEntryError;
}

export const OneSituationPerEmotionJournalEntry = new OneSituationPerEmotionJournalEntryFactory();
