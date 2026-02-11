import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("AlarmOrchestrator", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);

  const saga = new Emotions.Sagas.AlarmOrchestrator({
    ...di.Adapters.System,
    ...di.Tools,
    AiGateway: di.Adapters.AI.AiGateway,
    AlarmCancellationLookup: di.Adapters.Emotions.AlarmCancellationLookup,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  const config = { from: di.Env.EMAIL_FROM, to: mocks.email };

  test("onAlarmGeneratedEvent - entry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
    expect(aiGatewayQuery).toHaveBeenCalledWith(expect.any(AI.Prompt), mocks.EmotionsAlarmEntryContext);
  });

  test("onAlarmGeneratedEvent - inactivity", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericInactivityAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmAdviceSavedEvent]);
    expect(aiGatewayQuery).toHaveBeenCalledWith(
      expect.any(AI.Prompt),
      mocks.EmotionsAlarmInactivityWeeklyContext,
    );
  });

  test("onAlarmGeneratedEvent - entry - finding entry fails", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockImplementation(
        mocks.throwIntentionalErrorAsync,
      ),
    );
    spies.use(spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.advice));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmGeneratedEvent - entry - missing entry", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using loggerInfo = spyOn(di.Adapters.System.Logger, "info");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
    expect(loggerInfo).toHaveBeenNthCalledWith(1, {
      message: "Missing prompt",
      component: "emotions",
      operation: "alarm_orchestrator_on_alarm_generated_event",
      metadata: { detection: mocks.entryDetection, language: SupportedLanguages.en },
    });
  });

  test("onAlarmGeneratedEvent - cancels alarm when advice requester fails", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericAlarmGeneratedEvent]));
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "query").mockImplementation(mocks.throwIntentionalErrorAsync));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onAlarmAdviceSavedEvent", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
      ]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationRequestedEvent]);
  });

  test("onAlarmNotificationRequestedEvent - missing contact", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ]),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using loggerInfo = spyOn(di.Adapters.System.Logger, "info");
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
    expect(loggerInfo).toHaveBeenCalledTimes(1);
  });

  test("onAlarmNotificationRequestedEvent - missing notification", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
      ]),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send");
    using loggerInfo = spyOn(di.Adapters.System.Logger, "info");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(loggerInfo).toHaveBeenCalledWith({
      message: "Missing notification",
      operation: "alarm_orchestrator_on_alarm_notification_requested_event",
      component: "emotions",
      metadata: { detection: mocks.entryDetection },
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onAlarmNotificationRequestedEvent - entry", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ]),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: {
        subject: "JOURNAL - emotional advice",
        html: `Advice for emotion entry: anger: ${mocks.advice.get()}`,
      },
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onAlarmNotificationRequestedEvent - inactivity", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
        mocks.GenericAlarmNotificationRequestedEvent,
      ]),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onAlarmNotificationRequestedEvent(mocks.GenericInactivityAlarmNotificationRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: {
        subject: "JOURNAL - inactivity advice",
        html: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      },
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmNotificationSentEvent]);
  });

  test("onEntryDeletedEvent - cancels pending alarm", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericAlarmGeneratedEvent,
        mocks.GenericAlarmAdviceSavedEvent,
      ]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([
        mocks.alarmId,
      ]),
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmCancelledEvent]);
  });

  test("onEntryDeletedEvent - does not cancel cancelled", async () => {
    using _ = spyOn(di.Adapters.Emotions.AlarmCancellationLookup, "listIdsForEntry").mockResolvedValue([]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onEntryDeletedEvent(mocks.GenericEntryDeletedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
