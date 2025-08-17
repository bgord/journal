import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type { AlarmDirectoryPort } from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class AlarmDirectoryDrizzle implements AlarmDirectoryPort {
  async listForUser(userId: Auth.VO.UserIdType) {
    const alarms = await db.query.alarms.findMany({
      where: and(eq(Schema.alarms.userId, userId)),
      orderBy: desc(Schema.alarms.generatedAt),
    });

    return alarms.map((alarm) => ({
      ...alarm,
      entryId: alarm.entryId as bg.UUIDType,
      status: alarm.status as VO.AlarmStatusEnum,
      name: alarm.name as VO.AlarmNameOption,
      advice: alarm.advice as VO.AlarmSnapshot["advice"],
      generatedAt: alarm.generatedAt as tools.TimestampType,
      lastEntryTimestamp: alarm.lastEntryTimestamp as tools.TimestampType | null,
      emotionLabel: alarm.emotionLabel as VO.GenevaWheelEmotion | null,
    }));
  }
}
