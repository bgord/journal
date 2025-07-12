import * as Emotions from "+emotions";

export const onEmotionJournalEntryDeletedEvent = async (event: Emotions.Events.EntryDeletedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.deleteEntry(event);
};
