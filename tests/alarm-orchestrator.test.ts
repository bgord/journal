import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Auth from "../modules/auth";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiClient();

describe("AlarmOrchestrator", () => {
  test("onAlarmGeneratedEvent - entry", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);
    spyOn(openAiClient, "request").mockResolvedValue(mocks.advice.get());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(openAiClient, "request").mockResolvedValue(mocks.advice.get());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericInactivityAlarmGeneratedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockImplementation(() => {
      throw new Error("Failed");
    });
    spyOn(openAiClient, "request").mockResolvedValue(mocks.advice.get());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);
    spyOn(openAiClient, "request").mockImplementation(() => {
      throw new Error();
    });

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
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

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent - missing contact", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);

    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent - mailer failed", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);

    const mailerSend = spyOn(Mailer, "send").mockImplementation(() => {
      throw new Error("MAILER_FAILED");
    });

    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent - entry", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);

    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });

    jest.restoreAllMocks();
  });

  test("onAlarmNotificationSentEvent - inactivity", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);

    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationSentEvent(mocks.GenericInactivityAlarmNotificationSentEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: mocks.email,
      subject: "Inactivity advice",
      html: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
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

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
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

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
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

    const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
