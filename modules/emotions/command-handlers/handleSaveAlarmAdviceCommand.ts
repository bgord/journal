import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleSaveAlarmAdviceCommand = async (command: Emotions.Commands.SaveAlarmAdviceCommandType) => {
  const history = await EventStore.find(
    Emotions.Aggregates.Alarm.events,
    Emotions.Aggregates.Alarm.getStream(command.payload.alarmId),
  );

  const alarm = Emotions.Aggregates.Alarm.build(command.payload.alarmId, history);
  await alarm.saveAdvice(command.payload.advice);

  await EventStore.save(alarm.pullEvents());
};
