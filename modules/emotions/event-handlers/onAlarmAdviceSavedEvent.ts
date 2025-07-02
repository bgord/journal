import * as Emotions from "+emotions";

export const onAlarmAdviceSavedEvent = async (event: Emotions.Events.AlarmAdviceSavedEventType) => {
  await Emotions.Repos.AlarmRepository.saveAdvice(event);
};
