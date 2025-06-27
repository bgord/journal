import { describe, expect, jest, spyOn, test } from "bun:test";
import { Mailer } from "../infra";
import { EventStore } from "../infra/event-store";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionExtremeIntensityLoggedEvent,
]);

const advice = new Emotions.VO.EmotionalAdvice("You should do something");

const openAiClient = new OpenAiClient();

describe("AlarmProcessing", () => {
  test("onEmotionLoggedEvent", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("onEmotionLoggedEvent - respects", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);

    expect(async () => saga.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent)).toThrow(
      Emotions.Policies.DailyAlarmLimit.error,
    );
    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onEmotionReappraisedEvent", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(0);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onEmotionReappraisedEvent(mocks.NegativeEmotionExtremeIntensityReappraisedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("onEmotionReappraisedEvent - respects", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);

    expect(async () =>
      saga.onEmotionReappraisedEvent(mocks.NegativeEmotionExtremeIntensityReappraisedEvent),
    ).toThrow(Emotions.Policies.DailyAlarmLimit.error);
    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    spyOn(Emotions.Services.EmotionalAdviceRequester.prototype, "ask").mockResolvedValue(advice);

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    spyOn(Emotions.Services.EmotionalAdviceRequester.prototype, "ask").mockImplementation(() => {
      throw new Error();
    });

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmAdviceSavedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent);

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Emotional advice",
      content: "Advice for emotion entry: anger: You should do something",
    });

    jest.restoreAllMocks();
  });

  test("onEmotionJournalEntryDeletedEvent - cancels pending alarm", async () => {
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

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onEmotionJournalEntryDeletedEvent(mocks.GenericEmotionJournalEntryDeletedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onEmotionJournalEntryDeletedEvent - does not cancel handled alarms", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onEmotionJournalEntryDeletedEvent(mocks.GenericEmotionJournalEntryDeletedEvent);

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  test("onEmotionJournalEntryDeletedEvent - does not cancel cancelled", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmCancelledEvent,
    ]);

    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmProcessing(openAiClient);
    await saga.onEmotionJournalEntryDeletedEvent(mocks.GenericEmotionJournalEntryDeletedEvent);

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
