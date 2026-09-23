import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.saveAdvice", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.saveAdvice(mocks.advice);

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmAdviceSavedEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: new AI.Advice(mocks.GenericAlarmAdviceSavedEvent.payload.advice),
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.advice_saved,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });

  test("AlarmAlreadyGenerated", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      deps,
    );

    expect(async () => alarm.saveAdvice(mocks.advice)).toThrow(
      Emotions.Invariants.AlarmAlreadyGenerated.error,
    );
    expect(alarm.pullEvents()).toEqual([]);
  });
});
