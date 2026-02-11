import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm", async () => {
  const di = await bootstrap();

  test("build new aggregate", () => {
    expect(Emotions.Aggregates.Alarm.build(mocks.alarmId, [], di.Adapters.System).pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const alarm = Emotions.Aggregates.Alarm.generate(
        mocks.alarmId,
        mocks.entryDetection,
        mocks.userId,
        di.Adapters.System,
      );

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: undefined,
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.generated,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });

  test("saveAdvice - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent],
      di.Adapters.System,
    );

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

  test("saveAdvice - AlarmAlreadyGenerated", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      di.Adapters.System,
    );

    expect(async () => alarm.saveAdvice(mocks.advice)).toThrow(
      Emotions.Invariants.AlarmAlreadyGenerated.error,
    );
    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      di.Adapters.System,
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

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent],
      di.Adapters.System,
    );

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ],
      di.Adapters.System,
    );

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });

  test("complete - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ],
      di.Adapters.System,
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

  test("complete - AlarmNotificationRequested", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => alarm.complete()).toThrow(Emotions.Invariants.AlarmNotificationRequested.error);
    });
  });

  test("cancel - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      di.Adapters.System,
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

  test("cancel - AlarmIsCancellable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
        mocks.GenericAlarmCancelledEvent,
      ],
      di.Adapters.System,
    );

    expect(async () => alarm.cancel()).toThrow(Emotions.Invariants.AlarmIsCancellable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });
});
