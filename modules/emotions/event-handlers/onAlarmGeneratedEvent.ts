import * as Emotions from "+emotions";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  // TODO: handle other
  if (event.payload.trigger.type === Emotions.Services.Alarms.AlarmTriggerEnum.entry) {
    const entry = await Emotions.Repos.EntryRepository.getByIdRaw(event.payload.trigger.entryId);

    await Emotions.Repos.AlarmRepository.generate(event, {
      label: entry.emotionLabel,
      intensity: entry.emotionIntensity,
    });
  }
};
