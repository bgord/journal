import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.logger);
const saga = new Emotions.Sagas.AlarmOrchestrator({
  EventBus,
  EventHandler,
  CommandBus,
  AiGateway: Adapters.AI.AiGateway,
  Mailer: Adapters.Mailer,
  AlarmCancellationLookup: Adapters.Emotions.AlarmCancellationLookup,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  UserContact: Adapters.Auth.UserContact,
  UserLanguage: Adapters.Preferences.UserLanguage,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  EMAIL_FROM: Env.EMAIL_FROM,
});

describe("AlarmOrchestrator", () => {
  test("onAlarmGeneratedEvent - entry", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockRejectedValue(new Error("Failed"));
    spyOn(Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Adapters.AI.AiGateway, "query").mockRejectedValue(new Error());
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmAdviceSavedEvent", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationRequestedEvent]);
  });

  test("onAlarmNotificationRequestedEvent - missing contact", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmNotificationRequestedEvent - mailer failed", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockRejectedValue(new Error("MAILER_FAILED"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).not.toHaveBeenCalledWith();
  });

  test("onAlarmNotificationRequestedEvent - entry", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onAlarmNotificationRequestedEvent - inactivity", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericInactivityAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Inactivity advice",
      html: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onEntryDeletedEvent - cancels pending alarm", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([mocks.alarmId]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    spyOn(Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
