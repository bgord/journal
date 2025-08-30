import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { AiGateway } from "+ai/open-host-services";

type Dependencies = {
  repo: Emotions.Ports.AlarmRepositoryPort;
  AiGateway: AiGateway;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

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
      deps.IdProvider.generate(),
      command.payload.detection,
      command.payload.userId,
      deps,
    );

    await deps.repo.save(alarm);
  };
