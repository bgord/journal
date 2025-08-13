import * as Emotions from "+emotions";
import { AiGateway } from "+infra/ai-gateway";
import { EventStore } from "+infra/event-store";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  switch (command.payload.detection.trigger.type) {
    case Emotions.VO.AlarmTriggerEnum.entry: {
      const check = await AiGateway.check(
        Emotions.ACL.createEmotionsAlarmEntryRequestContext(
          command.payload.userId,
          command.payload.detection.trigger.entryId,
        ),
      );

      if (check.violations.length > 0) return;

      break;
    }

    case Emotions.VO.AlarmTriggerEnum.inactivity: {
      const check = await AiGateway.check(
        Emotions.ACL.createEmotionsAlarmInactivityRequestContext(command.payload.userId),
      );

      if (check.violations.length > 0) return;

      break;
    }
  }

  const alarmId = crypto.randomUUID();
  const alarm = Emotions.Aggregates.Alarm.generate(
    alarmId,
    command.payload.detection,
    command.payload.userId,
  );

  await EventStore.save(alarm.pullEvents());
};
