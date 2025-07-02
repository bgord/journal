import * as Emotions from "+emotions";
import { EventStore } from "+infra";

export const handleSendAlarmNotificationCommand = async (
  command: Emotions.Commands.SendAlarmNotificationCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.Alarm.events,
    Emotions.Aggregates.Alarm.getStream(command.payload.alarmId),
  );

  const alarm = Emotions.Aggregates.Alarm.build(command.payload.alarmId, history);

  await alarm.notify();

  await EventStore.save(alarm.pullEvents());
};
