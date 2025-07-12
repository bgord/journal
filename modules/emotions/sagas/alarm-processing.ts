import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import type { EventBus } from "+infra/event-bus";
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
    this.eventBus.on(Events.ENTRY_DELETED_EVENT, this.onEmotionJournalEntryDeletedEvent.bind(this));
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
        emotionJournalEntryId: event.payload.emotionJournalEntryId,
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
        emotionJournalEntryId: event.payload.emotionJournalEntryId,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const entry = await Repos.EmotionJournalEntryRepository.getById(event.payload.emotionJournalEntryId);

    const prompt = new Services.EmotionalAdvicePrompt(entry, event.payload.alarmName).generate();

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
          emotionJournalEntryId: event.payload.emotionJournalEntryId,
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
        emotionJournalEntryId: event.payload.emotionJournalEntryId,
      },
    } satisfies Commands.SendAlarmNotificationCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmNotificationSentEvent(event: Events.AlarmNotificationSentEventType) {
    const entry = await Repos.EmotionJournalEntryRepository.getById(event.payload.emotionJournalEntryId);

    const alarm = await Repos.AlarmRepository.getById(event.payload.alarmId);

    const composer = new Services.EmotionalAdviceNotificationComposer(entry);

    const notification = composer.compose(alarm.advice as VO.EmotionalAdviceType);

    await Mailer.send({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Emotional advice",
      html: notification,
    });
  }

  async onEmotionJournalEntryDeletedEvent(event: Events.EntryDeletedEventType) {
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
