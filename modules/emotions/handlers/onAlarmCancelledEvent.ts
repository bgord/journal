import * as Emotions from "../";

export const onAlarmCancelledEvent = async (event: Emotions.Events.AlarmCancelledEventType) => {
  await Emotions.Repos.AlarmRepository.cancel(event);
};
