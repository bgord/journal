import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as ACL from "+emotions/acl";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Ports from "+emotions/ports";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import type { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";

export class AlarmOrchestrator {
  constructor(
    eventBus: typeof EventBus,
    private readonly commandBus: typeof CommandBus,
    EventHandler: bg.EventHandler,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
    private readonly alarmCancellationLookup: Ports.AlarmCancellationLookupPort,
    private readonly entrySnapshot: Ports.EntrySnapshotPort,
    private readonly userContact: Auth.OHQ.UserContactOHQ,
  ) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, EventHandler.handle(this.onAlarmGeneratedEvent.bind(this)));
    eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    eventBus.on(Events.ALARM_NOTIFICATION_REQUESTED_EVENT, this.onAlarmNotificationRequestedEvent.bind(this));
    eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    try {
      const prompt = await new ACL.AiPrompts.AlarmPromptFactory(this.entrySnapshot).create(detection);
      // @ts-expect-error
      const context = ACL.createAlarmRequestContext(event.payload.userId, event.payload.trigger.entryId);
      const advice = await this.AiGateway.query(prompt, context);

      const command = Commands.SaveAlarmAdviceCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId: event.payload.alarmId, advice },
      } satisfies Commands.SaveAlarmAdviceCommandType);

      await this.commandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.CancelAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.commandBus.emit(command.name, command);
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.RequestAlarmNotificationCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.REQUEST_ALARM_NOTIFICATION_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.SendAlarmNotificationCommandType);

    await this.commandBus.emit(command.name, command);
  }

  async onAlarmNotificationRequestedEvent(event: Events.AlarmNotificationRequestedEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.CANCEL_ALARM_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const contact = await this.userContact.getPrimary(event.payload.userId);
    if (!contact?.address) return this.commandBus.emit(cancel.name, cancel);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new AI.Advice(event.payload.advice);

    const notification = await new Services.AlarmNotificationFactory(this.entrySnapshot).create(
      detection,
      advice,
    );

    try {
      await this.mailer.send({ from: Env.EMAIL_FROM, to: contact.address, ...notification.get() });

      const complete = Commands.CompleteAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.COMPLETE_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CompleteAlarmCommandType);

      await this.commandBus.emit(complete.name, complete);
    } catch {}
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await this.alarmCancellationLookup.listIdsForEntry(event.payload.entryId);

    for (const alarmId of cancellableAlarmIds) {
      const command = Commands.CancelAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await this.commandBus.emit(command.name, command);
    }
  }
}
