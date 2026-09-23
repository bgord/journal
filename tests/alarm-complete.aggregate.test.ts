import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.complete", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.complete();

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationSentEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: new AI.Advice(mocks.GenericAlarmAdviceSavedEvent.payload.advice),
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.completed,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });

  test("AlarmNotificationRequested", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => alarm.complete()).toThrow(Emotions.Invariants.AlarmNotificationRequested.error);
    });
  });
});
