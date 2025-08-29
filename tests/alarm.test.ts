import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { IdProvider: Adapters.IdProvider };

describe("Alarm", () => {
  test("build new aggregate", () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [], deps);
    expect(alarm.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const alarm = Emotions.Aggregates.Alarm.generate(
        mocks.alarmId,
        mocks.entryDetection,
        mocks.userId,
        deps,
      );
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
    });
  });

  test("saveAdvice - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.saveAdvice(mocks.advice);
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmAdviceSavedEvent]);
    });
  });

  test("saveAdvice - AlarmAlreadyGenerated", async () => {
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

  test("notify - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.notify();
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationRequestedEvent]);
    });
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

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
      deps,
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
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.complete();
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationSentEvent]);
    });
  });

  test("complete - AlarmNotificationRequested", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => alarm.complete()).toThrow(Emotions.Invariants.AlarmNotificationRequested.error);
    });
  });

  test("cancel - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(
      mocks.alarmId,
      [mocks.GenericAlarmGeneratedEvent, mocks.GenericAlarmAdviceSavedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.cancel();
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmCancelledEvent]);
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
      deps,
    );

    expect(async () => alarm.cancel()).toThrow(Emotions.Invariants.AlarmIsCancellable.error);
    expect(alarm.pullEvents()).toEqual([]);
  });
});
