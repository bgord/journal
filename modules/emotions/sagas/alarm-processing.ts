import type { EventBus } from "../../../infra/event-bus";
import { EventStore } from "../../../infra/event-store";
import * as Aggregates from "../aggregates";
import * as Events from "../events";
import * as Services from "../services";

export class AlarmProcessing {
  constructor(private readonly AiClient: Services.AiClient) {}

  register(eventBus: typeof EventBus) {
    eventBus.on(Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent);
    eventBus.on(Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent);
  }

  async onAlarmGeneratedEvent(event: Events.AlarmGeneratedEventType) {
    const entry = Aggregates.EmotionJournalEntry.build(
      event.payload.emotionJournalEntryId,
      await EventStore.find(
        Aggregates.EmotionJournalEntry.events,
        Aggregates.EmotionJournalEntry.getStream(
          event.payload.emotionJournalEntryId,
        ),
      ),
    );

    const emotionalAdviceRequester = new Services.EmotionalAdviceRequester(
      this.AiClient,
      entry,
      event.payload.alarmName,
    );

    const advice = await emotionalAdviceRequester.ask();

    const alarm = Aggregates.Alarm.build(
      event.payload.emotionJournalEntryId,
      await EventStore.find(
        Aggregates.Alarm.events,
        Aggregates.Alarm.getStream(event.payload.alarmId),
      ),
    );

    await alarm.saveAdvice(advice);

    await EventStore.save(alarm.pullEvents());
  }

  async onAlarmAdviceSavedEvent(event: Events.AlarmAdviceSavedEventType) {
    const alarm = Aggregates.Alarm.build(
      event.payload.emotionJournalEntryId,
      await EventStore.find(
        Aggregates.Alarm.events,
        Aggregates.Alarm.getStream(event.payload.alarmId),
      ),
    );

    await alarm.notify();

    await EventStore.save(alarm.pullEvents());
  }
}
