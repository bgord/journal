import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ShareableLinkAccessValidType } from "+publishing/open-host-queries";

export class EntryRepository {
  static async getById(id: VO.EntryIdType) {
    const [result] = await db.select().from(Schema.entries).where(eq(Schema.entries.id, id));
    return result as Schema.SelectEntries;
  }

  static async listForUser(userId: Auth.VO.UserIdType) {
    return db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });
  }

  static async listShared(access: ShareableLinkAccessValidType) {
    const result = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        gte(Schema.entries.startedAt, access.details.dateRange.getStart()),
        lte(Schema.entries.startedAt, access.details.dateRange.getEnd()),
        eq(Schema.entries.userId, access.details.ownerId),
      ),
      with: { alarms: true },
    });

    return result.map(EntryRepository.formatFull);
  }

  static async findInWeekForUser(
    week: tools.Week,
    userId: Auth.VO.UserIdType,
  ): Promise<Schema.SelectEntries[]> {
    return db
      .select()
      .from(Schema.entries)
      .where(
        and(
          gte(Schema.entries.startedAt, week.getStart()),
          lte(Schema.entries.startedAt, week.getEnd()),
          eq(Schema.entries.userId, userId),
        ),
      );
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms): Schema.SelectEntriesFull {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
