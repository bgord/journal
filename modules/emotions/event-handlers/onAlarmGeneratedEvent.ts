import * as Emotions from "+emotions";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  await Emotions.Repos.AlarmRepository.generate(event);
};
