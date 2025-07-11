import type * as Events from "+emotions/events";
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

  static async generate(event: Events.AlarmGeneratedEventType) {
    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      entryId: event.payload.entryId,
      status: VO.AlarmStatusEnum.generated,
      generatedAt: event.createdAt,
    });
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

  static async getCreatedTodayCount(): Promise<number> {
    const startOfDay = tools.DateCalculator.getStartOfDayTsInTz({
      now: tools.Timestamp.parse(Date.now()),
      timeZoneOffsetMs: 0,
    });

    return db.$count(Schema.alarms, gte(Schema.alarms.generatedAt, startOfDay));
  }
}
