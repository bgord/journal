import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("Alarm", () => {
  test("build new aggregate", () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, []);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const alarm = Emotions.Aggregates.Alarm.generate(mocks.alarmId, mocks.entryDetection, mocks.userId);

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
    });
  });

  test("saveAdvice - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.saveAdvice(mocks.advice);
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmAdviceSavedEvent]);
    });
  });

  test("saveAdvice - AlarmAlreadyGenerated", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    expect(async () => alarm.saveAdvice(mocks.advice)).toThrow(
      Emotions.Invariants.AlarmAlreadyGenerated.error,
    );

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.notify();
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationSentEvent]);
    });
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    expect(async () => alarm.notify()).toThrow(Emotions.Invariants.AlarmAdviceAvailable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("cancel - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      alarm.cancel();
      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmCancelledEvent]);
    });
  });

  test("cancel - AlarmIsCancellable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
      mocks.GenericAlarmCancelledEvent,
    ]);

    expect(async () => alarm.cancel()).toThrow(Emotions.Invariants.AlarmIsCancellable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });
});
