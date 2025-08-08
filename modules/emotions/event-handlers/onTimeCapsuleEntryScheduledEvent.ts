import * as Emotions from "+emotions";

export const onTimeCapsuleEntryScheduledEvent = async (
  event: Emotions.Events.TimeCapsuleEntryScheduledEventType,
) => {
  await Emotions.Repos.TimeCapsuleEntryRepository.create(event);
};
