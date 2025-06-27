import * as Emotions from "../";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  await Emotions.Repos.AlarmRepository.generate(event);
};
