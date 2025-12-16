import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import { EnvironmentLoader } from "+infra/env";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("AlarmOrchestrator", async () => {
  const di = await bootstrap(await EnvironmentLoader.load());
  registerEventHandlers(di);
  registerCommandHandlers(di);

  const saga = new Emotions.Sagas.AlarmOrchestrator({
    ...di.Adapters.System,
    AiGateway: di.Adapters.AI.AiGateway,
    AlarmCancellationLookup: di.Adapters.Emotions.AlarmCancellationLookup,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  test("onAlarmGeneratedEvent - entry", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockRejectedValue(new Error("Failed"));
    spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(di.Adapters.AI.AiGateway, "query").mockRejectedValue(new Error());
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmAdviceSavedEvent", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationRequestedEvent]);
  });

  test("onAlarmNotificationRequestedEvent - missing contact", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmNotificationRequestedEvent - mailer failed", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockRejectedValue(new Error("MAILER_FAILED"));
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).not.toHaveBeenCalledWith();
  });

  test("onAlarmNotificationRequestedEvent - entry", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - emotional advice",
      html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onAlarmNotificationRequestedEvent - inactivity", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
      mocks.GenericAlarmNotificationRequestedEvent,
    ]);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericInactivityAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - inactivity advice",
      html: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onEntryDeletedEvent - cancels pending alarm", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([mocks.alarmId]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    spyOn(di.Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
