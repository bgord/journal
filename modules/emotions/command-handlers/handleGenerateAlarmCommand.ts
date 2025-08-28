import * as Emotions from "+emotions";
import type { AiGateway } from "+ai/open-host-services";

type Dependencies = { repo: Emotions.Ports.AlarmRepositoryPort; AiGateway: AiGateway };

export const handleGenerateAlarmCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.GenerateAlarmCommandType) => {
    const check = await deps.AiGateway.check(
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

    await deps.repo.save(alarm);
  };
