import * as Emotions from "+emotions";
import { AiGateway } from "+infra/ai-gateway";
import { EventStore } from "+infra/event-store";

export const handleGenerateAlarmCommand = async (command: Emotions.Commands.GenerateAlarmCommandType) => {
  const check = await AiGateway.check(
    Emotions.ACL.createAlarmRequestContext(
      command.payload.userId,
      // @ts-expect-error
      command.payload.detection.trigger.entryId,
    ),
  );

  if (check.violations.length > 0) return;

  const alarmId = crypto.randomUUID();
  const alarm = Emotions.Aggregates.Alarm.generate(
    alarmId,
    command.payload.detection,
    command.payload.userId,
  );

  await EventStore.save(alarm.pullEvents());
};
