import * as Emotions from "+emotions";

export const onAlarmNotificationSentEvent = async (event: Emotions.Events.AlarmNotificationSentEventType) => {
  await Emotions.Repos.AlarmRepository.notify(event);
};
