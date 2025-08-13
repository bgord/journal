import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  const alarmsTodayForUserCount = await Emotions.Queries.CountTodaysAlarmsForUser.execute(
    command.payload.userId,
  );
  Emotions.Invariants.DailyAlarmLimit.perform(alarmsTodayForUserCount);

  switch (command.payload.detection.trigger.type) {
    case Emotions.VO.AlarmTriggerEnum.entry: {
      const entryAlarmsCount = await Emotions.Queries.CountAlarmsForEntry.execute(
        command.payload.detection.trigger.entryId,
      );
      Emotions.Invariants.EntryAlarmLimit.perform({ count: entryAlarmsCount });

      break;
    }

    case Emotions.VO.AlarmTriggerEnum.inactivity:
      break;
  }

  const alarmId = crypto.randomUUID();
  const alarm = Emotions.Aggregates.Alarm.generate(
    alarmId,
    command.payload.detection,
    command.payload.userId,
  );

  await EventStore.save(alarm.pullEvents());
};
