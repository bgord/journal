import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { Mailer } from "+infra/adapters";
import { AiGateway } from "+infra/adapters/ai";
import { UserContact } from "+infra/adapters/auth";
import { AlarmCancellationLookup, EntrySnapshot } from "+infra/adapters/emotions";
import { UserLanguage } from "+infra/adapters/preferences";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger.adapter";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const saga = new Emotions.Sagas.AlarmOrchestrator({
  EventBus,
  EventHandler,
  CommandBus,
  AiGateway,
  Mailer,
  AlarmCancellationLookup,
  EntrySnapshot,
  UserContact,
  UserLanguage,
  EMAIL_FROM: Env.EMAIL_FROM,
});

describe("AlarmOrchestrator", () => {
  test("onAlarmGeneratedEvent - entry", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EntrySnapshot, "getById").mockImplementation(() => {
      throw new Error("Failed");
    });
    spyOn(AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(AiGateway, "query").mockImplementation(() => {
      throw new Error();
    });
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
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
    spyOn(UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
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
    spyOn(UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(() => {
      throw new Error("MAILER_FAILED");
    });
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
    spyOn(UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
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
    spyOn(UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
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
    spyOn(AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([mocks.alarmId]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    spyOn(AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
