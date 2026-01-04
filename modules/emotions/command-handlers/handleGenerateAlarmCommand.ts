import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import * as Emotions from "+emotions";

type Dependencies = {
  repo: Emotions.Ports.AlarmRepositoryPort;
  AiGateway: AI.Ports.AiGatewayPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleGenerateAlarmCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.GenerateAlarmCommandType) => {
    const context = Emotions.ACL.createAlarmRequestContext(
      deps,
      command.payload.userId,
      // @ts-expect-error
      command.payload.detection.trigger.entryId,
    );

    const check = await deps.AiGateway.check(context);

    if (check.violations.length > 0) return;

    const alarm = Emotions.Aggregates.Alarm.generate(
      deps.IdProvider.generate(),
      command.payload.detection,
      command.payload.userId,
      deps,
    );

    await deps.repo.save(alarm);
  };
