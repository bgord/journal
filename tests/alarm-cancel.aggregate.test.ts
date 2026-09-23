import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.cancel", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.cancel();

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmCancelledEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: new AI.Advice(mocks.GenericAlarmAdviceSavedEvent.payload.advice),
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.cancelled,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });

  test("AlarmIsCancellable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
        mocks.GenericAlarmCancelledEvent,
      ],
      deps,
    );

    expect(async () => alarm.cancel()).toThrow(Emotions.Invariants.AlarmIsCancellable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });
});
