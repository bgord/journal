import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.notify", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.notify();

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationRequestedEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: new AI.Advice(mocks.GenericAlarmAdviceSavedEvent.payload.advice),
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.notification_requested,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });

  test("AlarmAdviceAvailable - advice not saved yet", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });

  test("AlarmAdviceAvailable - already notified", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ],
      deps,
    );

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });
});
