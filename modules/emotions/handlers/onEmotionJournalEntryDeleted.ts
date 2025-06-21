import type * as Events from "../events";
import * as Repos from "../repositories";

export const onEmotionJournalEntryDeletedEvent = async (
  event: Events.EmotionJournalEntryDeletedEventType,
) => {
  await Repos.EmotionJournalEntryRepository.deleteEntry(event);
};
