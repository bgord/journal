import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as AI from "+ai";
import type * as Auth from "+auth";
import type { LanguagesType } from "+languages";
import * as ACL from "+emotions/acl";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import type * as Ports from "+emotions/ports";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";

type AcceptedEvent =
  | Events.AlarmGeneratedEventType
  | Events.AlarmAdviceSavedEventType
  | Events.AlarmNotificationRequestedEventType
  | Events.EntryDeletedEventType;

type AcceptedCommand =
  | Commands.SaveAlarmAdviceCommandType
  | Commands.CancelAlarmCommandType
  | Commands.RequestAlarmNotificationCommandType
  | Commands.CompleteAlarmCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  AiGateway: AI.AiGatewayPort;
  Mailer: bg.MailerPort;
  Logger: bg.LoggerPort;
  AlarmCancellationLookup: Ports.AlarmCancellationLookupPort;
  EntrySnapshot: Ports.EntrySnapshotPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  EMAIL_FROM: tools.EmailType;
};

export class AlarmOrchestrator {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Events.ALARM_GENERATED_EVENT,
      deps.EventHandler.handle(this.onAlarmGeneratedEvent.bind(this)),
    );
    deps.EventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    deps.EventBus.on(
      Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
      this.onAlarmNotificationRequestedEvent.bind(this),
    );
    deps.EventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }
  // Stryker restore all

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    const cancel = bg.command(
      Commands.CancelAlarmCommand,
      { payload: { alarmId: event.payload.alarmId } },
      this.deps,
    );

    try {
      const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);
      const prompt = await new ACL.AiPrompts.AlarmPromptFactory(this.deps.EntrySnapshot, language).create(
        detection,
      );

      if (!prompt) {
        this.deps.Logger.info({
          message: "Missing prompt",
          operation: "alarm_orchestrator_on_alarm_generated_event",
          component: "emotions",
          metadata: { detection, language },
        });

        return this.deps.CommandBus.emit(cancel);
      }

      const context = ACL.createAlarmRequestContext(
        this.deps,
        event.payload.userId,
        // @ts-expect-error
        event.payload.trigger.entryId,
      );
      const advice = await this.deps.AiGateway.query(prompt, context);

      const command = bg.command(
        Commands.SaveAlarmAdviceCommand,
        { payload: { alarmId: event.payload.alarmId, advice } },
        this.deps,
      );

      await this.deps.CommandBus.emit(command);
    } catch (_error) {
      await this.deps.CommandBus.emit(cancel);
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = bg.command(
      Commands.RequestAlarmNotificationCommand,
      { payload: { alarmId: event.payload.alarmId } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }

  async onAlarmNotificationRequestedEvent(event: Events.AlarmNotificationRequestedEventType) {
    const cancel = bg.command(
      Commands.CancelAlarmCommand,
      { payload: { alarmId: event.payload.alarmId } },
      this.deps,
    );

    const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);
    if (!contact?.address) return this.deps.CommandBus.emit(cancel);

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new AI.Advice(event.payload.advice);

    const message = await new Services.AlarmNotificationFactory(this.deps.EntrySnapshot, language).create(
      detection,
      advice,
    );

    if (!message) {
      this.deps.Logger.info({
        message: "Missing notification",
        operation: "alarm_orchestrator_on_alarm_notification_requested_event",
        component: "emotions",
        metadata: { detection },
      });

      return this.deps.CommandBus.emit(cancel);
    }

    try {
      const config = { to: contact.address, from: this.deps.EMAIL_FROM };

      await this.deps.Mailer.send(new bg.MailerTemplate(config, message));

      const complete = bg.command(
        Commands.CompleteAlarmCommand,
        { payload: { alarmId: event.payload.alarmId } },
        this.deps,
      );

      await this.deps.CommandBus.emit(complete);
    } catch {}
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await this.deps.AlarmCancellationLookup.listIdsForEntry(
      event.payload.entryId,
    );

    for (const alarmId of cancellableAlarmIds) {
      const command = bg.command(Commands.CancelAlarmCommand, { payload: { alarmId } }, this.deps);

      await this.deps.CommandBus.emit(command);
    }
  }
}
