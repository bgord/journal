import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ShareableLinkAccessValidType } from "+publishing/open-host-queries";

export class EntryRepository {
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

  static formatFull(entry: Schema.SelectEntriesWithAlarms): Schema.SelectEntriesFull {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
