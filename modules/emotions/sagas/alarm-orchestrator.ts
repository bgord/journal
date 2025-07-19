import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";
import { logger } from "+infra/logger";
import { Mailer } from "+infra/mailer";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class AlarmOrchestrator {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiClient: Services.AiClient,
  ) {}

  register() {
    this.eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent.bind(this));
    this.eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    this.eventBus.on(Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent.bind(this));
    this.eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const detection = new Alarms.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    // TODO: handle other types
    if (detection.trigger.type === VO.AlarmTriggerEnum.entry) {
      const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);

      const prompt = new Services.EntryAlarmAdvicePromptBuilder(
        entry,
        detection.name,
        entry.language as SupportedLanguages,
      ).generate();

      try {
        const advice = await this.AiClient.request(prompt);

        const command = Commands.SaveAlarmAdviceCommand.parse({
          id: bg.NewUUID.generate(),
          correlationId: bg.CorrelationStorage.get(),
          name: Commands.SAVE_ALARM_ADVICE_COMMAND,
          createdAt: tools.Timestamp.parse(Date.now()),
          payload: { alarmId: event.payload.alarmId, advice: new VO.Advice(advice) },
        } satisfies Commands.SaveAlarmAdviceCommandType);

        await CommandBus.emit(command.name, command);
      } catch (_error) {
        const command = Commands.CancelAlarmCommand.parse({
          id: bg.NewUUID.generate(),
          correlationId: bg.CorrelationStorage.get(),
          name: Commands.CANCEL_ALARM_COMMAND,
          createdAt: tools.Timestamp.parse(Date.now()),
          payload: { alarmId: event.payload.alarmId },
        } satisfies Commands.CancelAlarmCommandType);

        await CommandBus.emit(command.name, command);
      }
    }
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.SendAlarmNotificationCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.SEND_ALARM_NOTIFICATION_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.SendAlarmNotificationCommandType);

    await CommandBus.emit(command.name, command);
  }

  // TODO: handle other types
  async onAlarmNotificationSentEvent(event: Events.AlarmNotificationSentEventType) {
    const cancel = Commands.CancelAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.CANCEL_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: { alarmId: event.payload.alarmId },
    } satisfies Commands.CancelAlarmCommandType);

    const detection = new Alarms.AlarmDetection(event.payload.trigger, event.payload.alarmName);

    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);
    const alarm = await Repos.AlarmRepository.getById(event.payload.alarmId);

    const advice = new VO.Advice(alarm.advice as VO.AdviceType);

    if (detection.trigger.type === VO.AlarmTriggerEnum.entry) {
      const entry = await Repos.EntryRepository.getByIdRaw(detection.trigger.entryId);

      const composer = new Services.EntryAlarmAdviceNotificationComposer(entry);
      const notification = composer.compose(advice);

      if (!contact?.email) return await CommandBus.emit(cancel.name, cancel);

      if (tools.FeatureFlag.isEnabled(Env.FF_MAILER_DISABLED)) {
        return logger.info({
          message: "[FF_MAILER_DISABLED] - email message",
          correlationId: bg.CorrelationStorage.get(),
          operation: "email_send",
          metadata: { from: "journal@example.com", to: contact.email, notification },
        });
      }

      try {
        await Mailer.send({ from: "journal@example.com", to: contact.email, ...notification.get() });
      } catch (_error) {
        return await CommandBus.emit(cancel.name, cancel);
      }
    }
  }

  async onEntryDeletedEvent(event: Events.EntryDeletedEventType) {
    const cancellableAlarmIds = await Repos.AlarmRepository.findCancellableByEntryId(event.payload.entryId);

    for (const alarmId of cancellableAlarmIds.map((result) => result.id)) {
      const command = Commands.CancelAlarmCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
