import * as Emotions from "../";

export const onSituationLoggedEvent = async (event: Emotions.Events.SituationLoggedEventType) => {
  await Emotions.Repos.EmotionJournalEntryRepository.logSituation(event);
};
