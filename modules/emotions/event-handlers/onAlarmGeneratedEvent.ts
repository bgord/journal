import * as Emotions from "+emotions";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  const entry = await Emotions.Repos.EntryRepository.getByIdRaw(event.payload.entryId);
  await Emotions.Repos.AlarmRepository.generate(event, {
    label: entry.emotionLabel,
    intensity: entry.emotionIntensity,
  });
};
