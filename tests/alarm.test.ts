import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("Alarm", () => {
  test("create new aggregate", () => {
    expect(() => Emotions.Aggregates.Alarm.create(mocks.alarmId)).not.toThrow();
  });

  test("build new aggregate", () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, []);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, []);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await alarm._generate(mocks.entryDetection, mocks.userId);
    });

    expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
  });

  test("generate - AlarmGeneratedOnce", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    expect(async () => alarm._generate(mocks.entryDetection, mocks.userId)).toThrow(
      Emotions.Policies.AlarmGeneratedOnce.error,
    );

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await alarm.saveAdvice(mocks.advice);
    });

    expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("generate - AlarmAlreadyGenerated", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    expect(async () => alarm.saveAdvice(mocks.advice)).toThrow(Emotions.Policies.AlarmAlreadyGenerated.error);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await alarm.notify();
    });

    expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

    expect(async () => alarm.notify()).toThrow(Emotions.Policies.AlarmAdviceAvailable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("notify - AlarmAdviceAvailable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    expect(async () => alarm.notify()).toThrow(Emotions.Policies.AlarmAdviceAvailable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });

  test("cancel - correct path", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await alarm.cancel();
    });

    expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmCancelledEvent]);
  });

  test("cancel - AlarmIsCancellable", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
      mocks.GenericAlarmCancelledEvent,
    ]);

    expect(async () => alarm.cancel()).toThrow(Emotions.Policies.AlarmIsCancellable.error);

    expect(alarm.pullEvents()).toEqual([]);
  });
});
