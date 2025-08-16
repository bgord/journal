import { and, desc, eq, notInArray } from "drizzle-orm";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class AlarmRepository {
  static async listForUser(userId: Auth.VO.UserIdType) {
    return db.query.alarms.findMany({
      where: and(eq(Schema.alarms.userId, userId)),
      orderBy: desc(Schema.alarms.generatedAt),
    });
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
