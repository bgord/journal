import type * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as AI from "+ai";
import type * as Emotions from "+emotions";
import { createAlarmRequestContext } from "../acl/ai-request-creator";
import { Alarm } from "../aggregates/alarm";
import { AlarmId } from "../value-objects/alarm-id";

type Dependencies = {
  repo: Emotions.Ports.AlarmRepositoryPort;
  AiGateway: AI.Ports.AiGatewayPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleGenerateAlarmCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.GenerateAlarmCommandType) => {
    const id = v.parse(AlarmId, deps.IdProvider.generate());

    const context = createAlarmRequestContext(
      deps,
      command.payload.userId,
      // @ts-expect-error
      command.payload.detection.trigger.entryId,
    );

    const check = await deps.AiGateway.check(context);

    if (check.violations.length > 0) return;

    const alarm = Alarm.generate(id, command.payload.detection, command.payload.userId, deps);

    await deps.repo.save(alarm);
  };
