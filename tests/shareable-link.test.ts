import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("Publishing", () => {
  test("build new aggregate", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, []);

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const shareableLink = Publishing.Aggregates.ShareableLink.create(
        mocks.shareableLinkId,
        mocks.publicationSpecification,
        mocks.dateRange,
        mocks.duration,
        mocks.userId,
      );

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkCreatedEvent]);
    });
  });

  test.skip("expire - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [
      mocks.GenericShareableLinkCreatedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.expire();
      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkExpiredEvent]);
    });
  });

  // test("saveAdvice - AlarmAlreadyGenerated", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
  //     mocks.GenericAlarmGeneratedEvent,
  //     mocks.GenericAlarmAdviceSavedEvent,
  //   ]);

  //   expect(async () => alarm.saveAdvice(mocks.advice)).toThrow(Emotions.Policies.AlarmAlreadyGenerated.error);

  //   expect(alarm.pullEvents()).toEqual([]);
  // });

  // test("notify - correct path", async () => {
  //   spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
  //     mocks.GenericAlarmGeneratedEvent,
  //     mocks.GenericAlarmAdviceSavedEvent,
  //   ]);

  //   await bg.CorrelationStorage.run(mocks.correlationId, async () => {
  //     alarm.notify();
  //     expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmNotificationSentEvent]);
  //   });
  // });

  // test("notify - AlarmAdviceAvailable", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);

  //   expect(async () => alarm.notify()).toThrow(Emotions.Policies.AlarmAdviceAvailable.error);

  //   expect(alarm.pullEvents()).toEqual([]);
  // });

  // test("notify - AlarmAdviceAvailable", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
  //     mocks.GenericAlarmGeneratedEvent,
  //     mocks.GenericAlarmAdviceSavedEvent,
  //     mocks.GenericAlarmNotificationSentEvent,
  //   ]);

  //   expect(async () => alarm.notify()).toThrow(Emotions.Policies.AlarmAdviceAvailable.error);

  //   expect(alarm.pullEvents()).toEqual([]);
  // });

  // test("cancel - correct path", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
  //     mocks.GenericAlarmGeneratedEvent,
  //     mocks.GenericAlarmAdviceSavedEvent,
  //   ]);

  //   await bg.CorrelationStorage.run(mocks.correlationId, async () => {
  //     alarm.cancel();
  //     expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmCancelledEvent]);
  //   });
  // });

  // test("cancel - AlarmIsCancellable", async () => {
  //   const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
  //     mocks.GenericAlarmGeneratedEvent,
  //     mocks.GenericAlarmAdviceSavedEvent,
  //     mocks.GenericAlarmNotificationSentEvent,
  //     mocks.GenericAlarmCancelledEvent,
  //   ]);

  //   expect(async () => alarm.cancel()).toThrow(Emotions.Policies.AlarmIsCancellable.error);

  //   expect(alarm.pullEvents()).toEqual([]);
  // });
});
