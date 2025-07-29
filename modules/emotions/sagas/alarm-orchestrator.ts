import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Ports from "+emotions/ports";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger";
import { Mailer } from "+infra/mailer";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class AlarmOrchestrator {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiClient: Ports.AiClientPort,
  ) {}

  register() {
    this.eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent.bind(this));
    this.eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    this.eventBus.on(Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent.bind(this));
    this.eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    try {
      const prompt = await Services.AlarmPromptFactory.create(detection);
      const advice = await this.AiClient.request(prompt);

      const command = Commands.SaveAlarmAdviceCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { alarmId: event.payload.alarmId, advice },
      } satisfies Commands.SaveAlarmAdviceCommandType);

      await CommandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.CancelAlarmCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { alarmId: event.payload.alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.SendAlarmNotificationCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.SEND_ALARM_NOTIFICATION_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.SendAlarmNotificationCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationSentEvent(event: Events.AlarmNotificationSentEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.CANCEL_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);
    if (!contact?.email) return CommandBus.emit(cancel.name, cancel);

    const alarm = await Repos.AlarmRepository.getById(event.payload.alarmId);

    const detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
    const advice = new VO.Advice(alarm.advice as VO.AdviceType);

    const notification = await Services.AlarmNotificationFactory.create(detection, advice);

    if (tools.FeatureFlag.isEnabled(Env.FF_MAILER_DISABLED)) {
      return logger.info({
        message: "[FF_MAILER_DISABLED] - email message",
        correlationId: bg.CorrelationStorage.get(),
        operation: "email_send",
        metadata: { from: Env.EMAIL_FROM, to: contact.email, notification },
      });
    }

    try {
      await Mailer.send({ from: Env.EMAIL_FROM, to: contact.email, ...notification.get() });
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
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
