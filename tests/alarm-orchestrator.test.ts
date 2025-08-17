import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import { Mailer } from "+infra/adapters";
import { AiGateway } from "+infra/adapters/ai";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const saga = new Emotions.Sagas.AlarmOrchestrator(EventBus, AiGateway, Mailer);

describe("AlarmOrchestrator", () => {
  test("onAlarmGeneratedEvent - entry", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericInactivityAlarmGeneratedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getById").mockImplementation(() => {
      throw new Error("Failed");
    });
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [mocks.GenericAlarmGeneratedEvent]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(AiGateway, "query").mockImplementation(() => {
      throw new Error();
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmAdviceSavedEvent", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationRequestedEvent]);
  });

  test("onAlarmNotificationRequestedEvent - missing contact", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmNotificationRequestedEvent - mailer failed", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(() => {
      throw new Error("MAILER_FAILED");
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmNotificationRequestedEvent - entry", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.EntryRepository, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
  });

  test("onAlarmNotificationRequestedEvent - inactivity", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.AlarmRepository, "getById").mockResolvedValue(mocks.alarm);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onAlarmNotificationRequestedEvent(mocks.GenericInactivityAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Inactivity advice",
      html: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
    });
  });

  test("onEntryDeletedEvent - cancels pending alarm", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([{ id: alarm.id }]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onEntryDeletedEvent - does not cancel handled alarms", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmCancelledEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);
    spyOn(Emotions.Repos.AlarmRepository, "findCancellableByEntryId").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
