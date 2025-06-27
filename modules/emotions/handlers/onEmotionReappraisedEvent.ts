import * as Emotions from "../";

export const onEmotionReappraisedEvent = async (event: Emotions.Events.EmotionReappraisedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.reappraiseEmotion(event);
};
