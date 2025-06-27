import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { CommandBus } from "../../../infra/command-bus";
import type { EventBus } from "../../../infra/event-bus";
import { EventStore } from "../../../infra/event-store";
import { Mailer } from "../../../infra/mailer";
import * as Aggregates from "../aggregates";
import * as Commands from "../commands";
import * as Events from "../events";
import * as Repositories from "../repositories";
import * as Services from "../services";
import * as VO from "../value-objects";

export class AlarmProcessing {
  constructor(private readonly AiClient: Services.AiClient) {}

  register(eventBus: typeof EventBus) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent);
    eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent);
    eventBus.on(Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent);
    eventBus.on(Events.EMOTION_JOURNAL_ENTRY_DELETED_EVENT, this.onEmotionJournalEntryDeletedEvent);
    eventBus.on(Events.EMOTION_LOGGED_EVENT, this.onEmotionLoggedEvent);
  }

  async onEmotionLoggedEvent(event: Events.EmotionLoggedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    const command = Commands.GenerateAlarmCommand.parse({
      id: bg.NewUUID.generate(),
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        emotionJournalEntryId: event.payload.id,
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
      name: Commands.GENERATE_ALARM_COMMAND,
      createdAt: tools.Timestamp.parse(Date.now()),
      payload: {
        alarmName: detection.name,
        emotionJournalEntryId: event.payload.id,
      },
    } satisfies Commands.GenerateAlarmCommandType);

    await CommandBus.emit(command.name, command);
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const entry = await Repositories.EmotionJournalEntryRepository.getById(
      event.payload.emotionJournalEntryId,
    );

    const emotionalAdviceRequester = new Services.EmotionalAdviceRequester(
      this.AiClient,
      entry,
      event.payload.alarmName,
    );

    try {
      const advice = await emotionalAdviceRequester.ask();

      const command = Commands.SaveAlarmAdviceCommand.parse({
        id: bg.NewUUID.generate(),
        name: Commands.SAVE_ALARM_ADVICE_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          alarmId: event.payload.alarmId,
          advice,
          emotionJournalEntryId: event.payload.emotionJournalEntryId,
        },
      } satisfies Commands.SaveAlarmAdviceCommandType);

      await CommandBus.emit(command.name, command);
    } catch (error) {
      const command = Commands.CancelAlarmCommand.parse({
        id: bg.NewUUID.generate(),
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
    const entry = await Repositories.EmotionJournalEntryRepository.getById(
      event.payload.emotionJournalEntryId,
    );

    const alarm = Aggregates.Alarm.build(
      event.payload.alarmId,
      await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(event.payload.alarmId)),
    );

    const composer = new Services.EmotionalAdviceNotificationComposer(entry);

    const notification = composer.compose(alarm.getAdvice() as VO.EmotionalAdvice);

    await Mailer.send({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Emotional advice",
      html: notification,
    });
  }

  async onEmotionJournalEntryDeletedEvent(event: Events.EmotionJournalEntryDeletedEventType) {
    const cancellableAlarmIds = await Repositories.AlarmRepository.findCancellableByEntryId(event.payload.id);

    for (const alarmId of cancellableAlarmIds.map((result) => result.id)) {
      const command = Commands.CancelAlarmCommand.parse({
        id: bg.NewUUID.generate(),
        name: Commands.CANCEL_ALARM_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { alarmId },
      } satisfies Commands.CancelAlarmCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
