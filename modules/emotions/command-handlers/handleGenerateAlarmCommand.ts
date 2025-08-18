import * as Emotions from "+emotions";
import { AiGateway } from "+ai/open-host-services";

export const handleGenerateAlarmCommand =
  (repo: Emotions.Ports.AlarmRepositoryPort, aiGateway: AiGateway) =>
  async (command: Emotions.Commands.GenerateAlarmCommandType) => {
    const check = await aiGateway.check(
      Emotions.ACL.createAlarmRequestContext(
        command.payload.userId,
        // @ts-expect-error
        command.payload.detection.trigger.entryId,
      ),
    );

    if (check.violations.length > 0) return;

    const alarm = Emotions.Aggregates.Alarm.generate(
      crypto.randomUUID(),
      command.payload.detection,
      command.payload.userId,
    );

    await repo.save(alarm);
  };
