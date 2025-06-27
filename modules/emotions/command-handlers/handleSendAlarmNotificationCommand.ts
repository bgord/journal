import { EventStore } from "../../../infra/event-store";
import * as Emotions from "../";

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
