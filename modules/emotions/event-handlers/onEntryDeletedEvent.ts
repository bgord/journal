import * as Emotions from "+emotions";

export const onEntryDeletedEvent = async (event: Emotions.Events.EntryDeletedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.deleteEntry(event);
};
