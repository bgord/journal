import * as Emotions from "+emotions";

export const onEmotionJournalEntryDeletedEvent = async (
  event: Emotions.Events.EmotionJournalEntryDeletedEventType,
) => {
  await Emotions.Repos.EmotionJournalEntryRepository.deleteEntry(event);
};
