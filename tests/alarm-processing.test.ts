import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiClient();

describe("AlarmProcessing", () => {
  test("onEmotionLoggedEvent", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("onEmotionLoggedEvent - respects DailyAlarmLimit", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => saga.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent)).toThrow(
        Emotions.Policies.DailyAlarmLimit.error,
      ),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onEmotionReappraisedEvent", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEmotionReappraisedEvent(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("onEmotionReappraisedEvent - respects DailyAlarmLimit", async () => {
    spyOn(bg.NewUUID, "generate").mockReturnValue(mocks.alarmId);
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () =>
        saga.onEmotionReappraisedEvent(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
      ).toThrow(Emotions.Policies.DailyAlarmLimit.error),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(openAiClient, "request").mockResolvedValue("You should do something");

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(openAiClient, "request").mockImplementation(() => {
      throw new Error();
    });

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmAdviceSavedEvent", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);

    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Emotional advice",
      html: "Advice for emotion entry: anger: You should do something",
    });

    jest.restoreAllMocks();
  });

  test("onEntryDeletedEvent - cancels pending alarm", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([
      // @ts-expect-error
      { id: alarm.id },
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onEntryDeletedEvent - does not cancel handled alarms", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmCancelledEvent,
    ]);

    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
