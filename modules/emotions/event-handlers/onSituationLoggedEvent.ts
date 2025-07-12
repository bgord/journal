import * as Emotions from "+emotions";

export const onSituationLoggedEvent = async (event: Emotions.Events.SituationLoggedEventType) => {
  await Emotions.Repos.EntryRepository.logSituation(event);
};
