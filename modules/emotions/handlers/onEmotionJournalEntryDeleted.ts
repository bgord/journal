import * as Emotions from "../";

export const onEmotionJournalEntryDeletedEvent = async (
  event: Emotions.Events.EmotionJournalEntryDeletedEventType,
) => {
  await Emotions.Repos.EmotionJournalEntryRepository.deleteEntry(event);
};
