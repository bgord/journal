import type { EventBus } from "../../../infra/event-bus";
import { EventStore } from "../../../infra/event-store";
import { Mailer } from "../../../infra/mailer";
import * as Aggregates from "../aggregates";
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

    await Services.AlarmCreator.create(detection, event.payload.id);
  }

  async onEmotionReappraisedEvent(event: Events.EmotionReappraisedEventType) {
    const detection = Services.AlarmDetector.detect({
      event,
      alarms: [Services.Alarms.NegativeEmotionExtremeIntensityAlarm],
    });

    if (!detection) return;

    await Services.AlarmCreator.create(detection, event.payload.id);
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const entry = Aggregates.EmotionJournalEntry.build(
      event.payload.emotionJournalEntryId,
      await EventStore.find(
        Aggregates.EmotionJournalEntry.events,
        Aggregates.EmotionJournalEntry.getStream(event.payload.emotionJournalEntryId),
      ),
    );

    const emotionalAdviceRequester = new Services.EmotionalAdviceRequester(
      this.AiClient,
      entry,
      event.payload.alarmName,
    );

    const alarm = Aggregates.Alarm.build(
      event.payload.alarmId,
      await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(event.payload.alarmId)),
    );

    try {
      const advice = await emotionalAdviceRequester.ask();
      await alarm.saveAdvice(advice);
    } catch (error) {
      await alarm.cancel();
    }

    await EventStore.save(alarm.pullEvents());
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const alarm = Aggregates.Alarm.build(
      event.payload.alarmId,
      await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(event.payload.alarmId)),
    );

    await alarm.notify();

    await EventStore.save(alarm.pullEvents());
  }

  async onAlarmNotificationSentEvent(event: Events.AlarmNotificationSentEventType) {
    const entry = Aggregates.EmotionJournalEntry.build(
      event.payload.emotionJournalEntryId,
      await EventStore.find(
        Aggregates.EmotionJournalEntry.events,
        Aggregates.EmotionJournalEntry.getStream(event.payload.emotionJournalEntryId),
      ),
    );

    const alarm = Aggregates.Alarm.build(
      event.payload.alarmId,
      await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(event.payload.alarmId)),
    );

    const composer = new Services.EmotionalAdviceNotificationComposer(entry.summarize());

    const notification = composer.compose(alarm.getAdvice() as VO.EmotionalAdvice);

    await Mailer.send({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Emotional advice",
      content: notification,
    });
  }

  async onEmotionJournalEntryDeletedEvent(event: Events.EmotionJournalEntryDeletedEventType) {
    const cancellableAlarms = await Repositories.AlarmRepository.findCancellableByEntryId(event.payload.id);

    for (const id of cancellableAlarms.map((result) => result.id)) {
      const alarm = Aggregates.Alarm.build(
        id,
        await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(id)),
      );

      await alarm.cancel();

      await EventStore.save(alarm.pullEvents());
    }
  }
}
