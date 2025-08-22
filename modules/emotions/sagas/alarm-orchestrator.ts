import type * as bg from "@bgord/bun";
import * as AI from "+ai";
import type * as Auth from "+auth";
import type * as Buses from "+app/ports";
import * as ACL from "+emotions/acl";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import type * as Ports from "+emotions/ports";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { createCommandEnvelope } from "../../../base";

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

export class AlarmOrchestrator {
  constructor(
    EventBus: Buses.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<AcceptedCommand>,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
    private readonly alarmCancellationLookup: Ports.AlarmCancellationLookupPort,
    private readonly entrySnapshot: Ports.EntrySnapshotPort,
    private readonly userContact: Auth.OHQ.UserContactOHQ,
    private readonly EMAIL_FROM: bg.EmailFromType,
  ) {
    EventBus.on(Events.ALARM_GENERATED_EVENT, EventHandler.handle(this.onAlarmGeneratedEvent.bind(this)));
    EventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    EventBus.on(Events.ALARM_NOTIFICATION_REQUESTED_EVENT, this.onAlarmNotificationRequestedEvent.bind(this));
    EventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    try {
      const prompt = await new ACL.AiPrompts.AlarmPromptFactory(this.entrySnapshot).create(detection);
      // @ts-expect-error
      const context = ACL.createAlarmRequestContext(event.payload.userId, event.payload.trigger.entryId);
      const advice = await this.AiGateway.query(prompt, context);

      const command = Commands.SaveAlarmAdviceCommand.parse({
        ...createCommandEnvelope(),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        payload: { alarmId: event.payload.alarmId, advice },
      } satisfies Commands.SaveAlarmAdviceCommandType);

      await this.CommandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.CancelAlarmCommand.parse({
        ...createCommandEnvelope(),
        name: Commands.CANCEL_ALARM_COMMAND,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.CommandBus.emit(command.name, command);
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.RequestAlarmNotificationCommand.parse({
      ...createCommandEnvelope(),
      name: Commands.REQUEST_ALARM_NOTIFICATION_COMMAND,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.RequestAlarmNotificationCommandType);

    await this.CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationRequestedEvent(event: Events.AlarmNotificationRequestedEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      ...createCommandEnvelope(),
      name: Commands.CANCEL_ALARM_COMMAND,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const contact = await this.userContact.getPrimary(event.payload.userId);
    if (!contact?.address) return this.CommandBus.emit(cancel.name, cancel);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new AI.Advice(event.payload.advice);

    const notification = await new Services.AlarmNotificationFactory(this.entrySnapshot).create(
      detection,
      advice,
    );

    try {
      await this.mailer.send({ from: this.EMAIL_FROM, to: contact.address, ...notification.get() });

      const complete = Commands.CompleteAlarmCommand.parse({
        ...createCommandEnvelope(),
        name: Commands.COMPLETE_ALARM_COMMAND,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CompleteAlarmCommandType);

      await this.CommandBus.emit(complete.name, complete);
    } catch {}
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await this.alarmCancellationLookup.listIdsForEntry(event.payload.entryId);

    for (const alarmId of cancellableAlarmIds) {
      const command = Commands.CancelAlarmCommand.parse({
        ...createCommandEnvelope(),
        name: Commands.CANCEL_ALARM_COMMAND,
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.CommandBus.emit(command.name, command);
    }
  }
}
