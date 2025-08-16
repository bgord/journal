import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class AlarmProjector {
  constructor(eventBus: typeof EventBus) {
    eventBus.on(Emotions.Events.ALARM_GENERATED_EVENT, this.onAlarmGeneratedEvent.bind(this));
    eventBus.on(Emotions.Events.ALARM_ADVICE_SAVED_EVENT, this.onAlarmAdviceSavedEvent.bind(this));
    eventBus.on(Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT, this.onAlarmNotificationSentEvent.bind(this));
    eventBus.on(Emotions.Events.ALARM_CANCELLED_EVENT, this.onAlarmCancelledEvent.bind(this));
  }

  async onAlarmGeneratedEvent(event: Emotions.Events.AlarmGeneratedEventType) {
    if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.entry) {
      const entry = await Emotions.Repos.EntryRepository.getByIdRaw(event.payload.trigger.entryId);

      await db.insert(Schema.alarms).values({
        id: event.payload.alarmId,
        name: event.payload.alarmName,
        entryId: event.payload.trigger.entryId,
        status: Emotions.VO.AlarmStatusEnum.generated,
        generatedAt: event.createdAt,
        emotionLabel: entry?.emotionLabel,
        emotionIntensity: entry?.emotionIntensity,
        inactivityDays: undefined,
        lastEntryTimestamp: undefined,
        userId: event.payload.userId,
        weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
      });
    }

    if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.inactivity) {
      await db.insert(Schema.alarms).values({
        id: event.payload.alarmId,
        name: event.payload.alarmName,
        entryId: undefined,
        status: Emotions.VO.AlarmStatusEnum.generated,
        generatedAt: event.createdAt,
        emotionLabel: undefined,
        emotionIntensity: undefined,
        inactivityDays: event.payload.trigger.inactivityDays,
        lastEntryTimestamp: event.payload.trigger.lastEntryTimestamp,
        userId: event.payload.userId,
        weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
      });
    }
  }

  async onAlarmAdviceSavedEvent(event: Emotions.Events.AlarmAdviceSavedEventType) {
    await db
      .update(Schema.alarms)
      .set({
        advice: event.payload.advice,
        status: Emotions.VO.AlarmStatusEnum.advice_saved,
      })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  async onAlarmCancelledEvent(event: Emotions.Events.AlarmCancelledEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: Emotions.VO.AlarmStatusEnum.cancelled })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  async onAlarmNotificationSentEvent(event: Emotions.Events.AlarmNotificationSentEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: Emotions.VO.AlarmStatusEnum.notification_sent })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }
}
