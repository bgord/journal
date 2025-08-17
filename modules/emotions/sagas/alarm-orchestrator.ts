import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as ACL from "+emotions/acl";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";

export class AlarmOrchestrator {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
  ) {
    this.eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent.bind(this));
    this.eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    this.eventBus.on(
      Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
      this.onAlarmNotificationRequestedEvent.bind(this),
    );
    this.eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    try {
      const prompt = await ACL.AiPrompts.AlarmPromptFactory.create(detection);
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

      await CommandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.CancelAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
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

    await CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationRequestedEvent(event: Events.AlarmNotificationRequestedEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.CANCEL_ALARM_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);
    if (!contact?.email) return CommandBus.emit(cancel.name, cancel);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new AI.Advice(event.payload.advice);

    const notification = await Services.AlarmNotificationFactory.create(detection, advice);

    try {
      await this.mailer.send({ from: Env.EMAIL_FROM, to: contact.email, ...notification.get() });

      const complete = Commands.CompleteAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.COMPLETE_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CompleteAlarmCommandType);

      await CommandBus.emit(complete.name, complete);
    } catch (_error) {
      return CommandBus.emit(cancel.name, cancel);
    }
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await Repos.AlarmRepository.findCancellableByEntryId(event.payload.entryId);

    for (const alarmId of cancellableAlarmIds.map((result) => result.id)) {
      const command = Commands.CancelAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
