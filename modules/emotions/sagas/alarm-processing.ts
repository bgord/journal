import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";
import { logger } from "+infra/logger";
import { Mailer } from "+infra/mailer";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class AlarmProcessing {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiClient: Services.AiClient,
  ) {}

  register() {
    this.eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent.bind(this));
    this.eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    this.eventBus.on(Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent.bind(this));
    this.eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEntryDeletedEvent.bind(this));
    this.eventBus.on(Events.EMOTION_LOGGED_EVENT, this.onEmotionLoggedEvent.bind(this));
    this.eventBus.on(Events.EMOTION_REAPPRAISED_EVENT, this.onEmotionReappraisedEvent.bind(this));
  }

  async onEmotionLoggedEvent(event: Events.EmotionLoggedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        entryId: event.payload.entryId,
        userId: event.payload.userId,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onEmotionReappraisedEvent(event: Events.EmotionReappraisedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        entryId: event.payload.entryId,
        userId: event.payload.userId,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const entry = await Repos.EntryRepository.getByIdRaw(event.payload.entryId);

    const prompt = new Services.EmotionalAdvicePrompt(
      entry,
      event.payload.alarmName,
      entry.language as SupportedLanguages,
    ).generate();

    try {
      const advice = await this.AiClient.request(prompt);

      const command = Commands.SaveAlarmAdviceCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          alarmId: event.payload.alarmId,
          advice: new VO.EmotionalAdvice(advice),
          entryId: event.payload.entryId,
        },
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

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const command = Commands.SendAlarmNotificationCommand.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.SEND_ALARM_NOTIFICATION_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmId: event.payload.alarmId,
        entryId: event.payload.entryId,
      },
    } satisfies Commands.SendAlarmNotificationCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationSentEvent(event: Events.AlarmNotificationSentEventType) {
    const entry = await Repos.EntryRepository.getByIdRaw(event.payload.entryId);
    const alarm = await Repos.AlarmRepository.getById(event.payload.alarmId);
    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);

    const composer = new Services.EmotionalAdviceNotificationComposer(entry);
    const notification = composer.compose(alarm.advice as VO.EmotionalAdviceType);

    if (!contact?.email) {
      // TODO: Cancel alarm on contact info missing
      return;
    }

    // TODO: Cancel alarm on Mailer.send error
    if (tools.FeatureFlag.isEnabled(Env.FF_MAILER_ENABLED)) {
      await Mailer.send({
        from: "journal@example.com",
        to: contact.email,
        subject: "Emotional advice",
        html: notification,
      });
    } else {
      logger.info({
        message: "[FF_MAILER_ENABLED] disabled - email message",
        correlationId: bg.CorrelationStorage.get(),
        operation: "email_send",
        metadata: {
          from: "journal@example.com",
          to: contact.email,
          subject: "Emotional advice",
          html: notification,
        },
      });
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
