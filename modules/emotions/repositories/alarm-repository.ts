import { asc, eq } from "drizzle-orm";
import { db } from "../../../infra/db";
import * as Schema from "../../../infra/schema";
import type * as Events from "../events";
import * as VO from "../value-objects";

export class AlarmRepository {
  static async generate(event: Events.AlarmGeneratedEventType) {
    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      emotionJournalEntryId: event.payload.emotionJournalEntryId,
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

  static async getAlarms() {
    return db.select().from(Schema.alarms).orderBy(asc(Schema.alarms.generatedAt));
  }
}
