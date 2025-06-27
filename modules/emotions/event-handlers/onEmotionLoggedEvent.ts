import * as Emotions from "../";

export const onEmotionLoggedEvent = async (event: Emotions.Events.EmotionLoggedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.logEmotion(event);
};
