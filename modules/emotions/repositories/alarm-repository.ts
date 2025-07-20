import * as Auth from "+auth";
import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq, notInArray } from "drizzle-orm";

export class AlarmRepository {
  static async list(userId: Auth.VO.UserIdType) {
    const inactivity = await db.query.alarms.findMany({
      where: and(
        eq(Schema.alarms.userId, userId),
        eq(Schema.alarms.name, VO.AlarmNameOption.INACTIVITY_ALARM),
      ),
    });

    return {
      inactivity: inactivity.map((alarm) => ({
        ...alarm,
        generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
      })),
    };
  }

  static async generate(
    event: Events.AlarmGeneratedEventType,
    metadata: {
      label?: Schema.SelectEntries["emotionLabel"];
      intensity?: Schema.SelectEntries["emotionIntensity"];
      inactivityDays?: VO.InactivityAlarmTriggerType["inactivityDays"];
      lastEntryTimestamp?: VO.InactivityAlarmTriggerType["inactivityDays"];
    },
  ) {
    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      entryId:
        event.payload.trigger.type === VO.AlarmTriggerEnum.entry ? event.payload.trigger.entryId : undefined,
      status: VO.AlarmStatusEnum.generated,
      generatedAt: event.createdAt,
      emotionLabel: metadata?.label,
      emotionIntensity: metadata?.intensity,
      inactivityDays: metadata?.inactivityDays,
      lastEntryTimestamp: metadata?.lastEntryTimestamp,
      userId: event.payload.userId,
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

  static async cancel(event: Events.AlarmCancelledEventType) {
    await db
      .update(Schema.alarms)
      .set({ status: VO.AlarmStatusEnum.cancelled })
      .where(eq(Schema.alarms.id, event.payload.alarmId));
  }

  static async getById(id: VO.AlarmIdType): Promise<Schema.SelectAlarms> {
    const result = await db.select().from(Schema.alarms).where(eq(Schema.alarms.id, id));

    return result[0] as Schema.SelectAlarms;
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
}
