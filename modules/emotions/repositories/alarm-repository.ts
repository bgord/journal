import type * as Auth from "+auth";
import type * as Events from "+emotions/events";
import * as Alarms from "+emotions/services/alarms";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq, gte, notInArray } from "drizzle-orm";

export class AlarmRepository {
  static async getById(id: VO.AlarmIdType): Promise<Schema.SelectAlarms> {
    const result = await db.select().from(Schema.alarms).where(eq(Schema.alarms.id, id));

    return result[0] as Schema.SelectAlarms;
  }

  static async generate(
    event: Events.AlarmGeneratedEventType,
    emotion: {
      label: Schema.SelectEntries["emotionLabel"];
      intensity: Schema.SelectEntries["emotionIntensity"];
    },
  ) {
    // TODO handle other
    if (event.payload.trigger.type === Alarms.AlarmTriggerEnum.entry) {
      await db.insert(Schema.alarms).values({
        id: event.payload.alarmId,
        name: event.payload.alarmName,
        entryId: event.payload.trigger.entryId,
        status: VO.AlarmStatusEnum.generated,
        generatedAt: event.createdAt,
        emotionLabel: emotion.label,
        emotionIntensity: emotion.intensity,
        userId: event.payload.userId,
      });
    }
  }

  static async saveAdvice(event: Events.AlarmAdviceSavedEventType) {
    await db
      .update(Schema.alarms)
      .set({
        advice: event.payload.advice,
        status: VO.AlarmStatusEnum.advice_saved,
      })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  static async notify(event: Events.AlarmNotificationSentEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: VO.AlarmStatusEnum.notification_sent })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  static async findCancellableByEntryId(entryId: VO.EntryIdType) {
    return db
      .select({ id: Schema.alarms.id })
      .from(Schema.alarms)
      .where(
        and(
          eq(Schema.alarms.entryId, entryId),
          notInArray(Schema.alarms.status, [
            VO.AlarmStatusEnum.cancelled,
            VO.AlarmStatusEnum.notification_sent,
          ]),
        ),
      );
  }

  static async cancel(event: Events.AlarmCancelledEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: VO.AlarmStatusEnum.cancelled })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  static async getCreatedTodayCountFor(userId: Auth.VO.UserIdType): Promise<number> {
    const startOfDay = tools.DateCalculator.getStartOfDayTsInTz({
      now: tools.Timestamp.parse(Date.now()),
      timeZoneOffsetMs: 0,
    });

    return db.$count(
      Schema.alarms,
      and(gte(Schema.alarms.generatedAt, startOfDay), eq(Schema.alarms.userId, userId)),
    );
  }

  static async getCreatedPerEntryId(entryId: VO.EntryIdType): Promise<number> {
    return db.$count(Schema.alarms, eq(Schema.alarms.entryId, entryId));
  }
}
