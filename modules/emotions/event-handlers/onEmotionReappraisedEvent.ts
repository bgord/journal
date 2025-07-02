import * as Emotions from "+emotions";

export const onEmotionReappraisedEvent = async (event: Emotions.Events.EmotionReappraisedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.reappraiseEmotion(event);
};
