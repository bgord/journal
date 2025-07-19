import * as Emotions from "+emotions";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.entry) {
    const entry = await Emotions.Repos.EntryRepository.getByIdRaw(event.payload.trigger.entryId);

    await Emotions.Repos.AlarmRepository.generate(event, {
      label: entry.emotionLabel,
      intensity: entry.emotionIntensity,
    });
  }

  if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.inactivity) {
    await Emotions.Repos.AlarmRepository.generate(event, {
      inactivityDays: event.payload.trigger.inactivityDays,
      lastEntryTimestamp: event.payload.trigger.lastEntryTimestamp,
    });
  }
};
