import * as AI from "+ai";
import * as Emotions from "+emotions";
import { AiGateway } from "+infra/ai-gateway";
import { EventStore } from "+infra/event-store";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  switch (command.payload.detection.trigger.type) {
    case Emotions.VO.AlarmTriggerEnum.entry: {
      const check = await AiGateway.check({
        userId: command.payload.userId,
        category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
        timestamp: command.createdAt,
        dimensions: { entryId: command.payload.detection.trigger.entryId },
      });

      if (check.violations.length) return;

      break;
    }

    case Emotions.VO.AlarmTriggerEnum.inactivity:
      await AiGateway.check({
        userId: command.payload.userId,
        category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
        timestamp: command.createdAt,
        dimensions: {},
      });

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
