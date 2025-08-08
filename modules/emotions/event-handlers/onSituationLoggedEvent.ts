import * as Emotions from "+emotions";

export const onSituationLoggedEvent = async (event: Emotions.Events.SituationLoggedEventType) => {
  await Emotions.Repos.EntryRepository.logSituation(event);

  const isTimeCapsule = await Emotions.Repos.TimeCapsuleEntryRepository.getById(event.payload.entryId);

  if (isTimeCapsule) {
    await Emotions.Repos.TimeCapsuleEntryRepository.publish(event.payload.entryId);
  }
};
