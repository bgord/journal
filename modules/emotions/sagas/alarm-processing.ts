import type { EventBus } from "../../../infra/event-bus";
import { EventStore } from "../../../infra/event-store";
import { Mailer } from "../../../infra/mailer";
import * as Aggregates from "../aggregates";
import * as Events from "../events";
import * as Services from "../services";
import * as VO from "../value-objects";

export class AlarmProcessing {
  constructor(private readonly AiClient: Services.AiClient) {}

  register(eventBus: typeof EventBus) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent);
    eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent);
    eventBus.on(Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent);
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

    const advice = await emotionalAdviceRequester.ask();

    const alarm = Aggregates.Alarm.build(
      event.payload.alarmId,
      await EventStore.find(Aggregates.Alarm.events, Aggregates.Alarm.getStream(event.payload.alarmId)),
    );

    await alarm.saveAdvice(advice);

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
}
