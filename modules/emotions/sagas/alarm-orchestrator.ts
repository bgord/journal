import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as AI from "+ai";
import type * as Auth from "+auth";
import type { SUPPORTED_LANGUAGES } from "+languages";
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
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  AiGateway: AI.AiGatewayPort;
  Mailer: bg.MailerPort;
  AlarmCancellationLookup: Ports.AlarmCancellationLookupPort;
  EntrySnapshot: Ports.EntrySnapshotPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>;
  EMAIL_FROM: tools.EmailType;
};

export class AlarmOrchestrator {
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

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    try {
      const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);
      const prompt = await new ACL.AiPrompts.AlarmPromptFactory(this.deps.EntrySnapshot, language).create(
        detection,
      );
      const context = ACL.createAlarmRequestContext(
        this.deps,
        event.payload.userId,
        // @ts-expect-error
        event.payload.trigger.entryId,
      );
      const advice = await this.deps.AiGateway.query(prompt, context);

      const command = Commands.SaveAlarmAdviceCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        payload: { alarmId: event.payload.alarmId, advice },
      } satisfies Commands.SaveAlarmAdviceCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.CancelAlarmCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Commands.CANCEL_ALARM_COMMAND,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.RequestAlarmNotificationCommand.parse({
      ...bg.createCommandEnvelope(this.deps),
      name: Commands.REQUEST_ALARM_NOTIFICATION_COMMAND,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.RequestAlarmNotificationCommandType);

    await this.deps.CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationRequestedEvent(event: Events.AlarmNotificationRequestedEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      ...bg.createCommandEnvelope(this.deps),
      name: Commands.CANCEL_ALARM_COMMAND,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);
    if (!contact?.address) return this.deps.CommandBus.emit(cancel.name, cancel);

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new AI.Advice(event.payload.advice);

    const notification = await new Services.AlarmNotificationFactory(
      this.deps.EntrySnapshot,
      language,
    ).create(detection, advice);

    try {
      await this.deps.Mailer.send({ from: this.deps.EMAIL_FROM, to: contact.address, ...notification.get() });

      const complete = Commands.CompleteAlarmCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Commands.COMPLETE_ALARM_COMMAND,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CompleteAlarmCommandType);

      await this.deps.CommandBus.emit(complete.name, complete);
    } catch {}
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await this.deps.AlarmCancellationLookup.listIdsForEntry(
      event.payload.entryId,
    );

    for (const alarmId of cancellableAlarmIds) {
      const command = Commands.CancelAlarmCommand.parse({
        ...bg.createCommandEnvelope(this.deps),
        name: Commands.CANCEL_ALARM_COMMAND,
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.deps.CommandBus.emit(command.name, command);
    }
  }
}
