import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import type { EventBusType } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: EventBusType; EventHandler: bg.EventHandlerPort };

export class AlarmProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.ALARM_GENERATED_EVENT,
      deps.EventHandler.handle(this.onAlarmGeneratedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
      deps.EventHandler.handle(this.onAlarmAdviceSavedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
      deps.EventHandler.handle(this.onAlarmNotificationRequestedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
      deps.EventHandler.handle(this.onAlarmNotificationSentEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.ALARM_CANCELLED_EVENT,
      deps.EventHandler.handle(this.onAlarmCancelledEvent.bind(this)),
    );
  }

  async onAlarmGeneratedEvent(event: Emotions.Events.AlarmGeneratedEventType) {
    if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.entry) {
      const entry = await db.query.entries.findFirst({
        where: eq(Schema.entries.id, event.payload.trigger.entryId),
      });

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
        weekIsoId: tools.Week.fromTimestampValue(event.createdAt).toIsoId(),
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
        weekIsoId: tools.Week.fromTimestampValue(event.createdAt).toIsoId(),
      });
    }
  }

  async onAlarmAdviceSavedEvent(event: Emotions.Events.AlarmAdviceSavedEventType) {
    await db
      .update(Schema.alarms)
      .set({ advice: event.payload.advice, status: Emotions.VO.AlarmStatusEnum.advice_saved })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  async onAlarmCancelledEvent(event: Emotions.Events.AlarmCancelledEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: Emotions.VO.AlarmStatusEnum.cancelled })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  async onAlarmNotificationRequestedEvent(event: Emotions.Events.AlarmNotificationRequestedEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: Emotions.VO.AlarmStatusEnum.notification_requested })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  async onAlarmNotificationSentEvent(event: Emotions.Events.AlarmNotificationSentEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: Emotions.VO.AlarmStatusEnum.completed })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }
}
