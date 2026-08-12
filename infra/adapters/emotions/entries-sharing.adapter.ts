import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class EntriesSharingOHQDrizzle implements Emotions.OHQ.EntriesSharingPort {
  async listForOwnerInRange(
    ownerId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<Emotions.OHQ.SharedEntryDto>> {
    const result = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(
        gte(Schema.entries.startedAt, dateRange.getStart().ms),
        lte(Schema.entries.startedAt, dateRange.getEnd().ms),
        eq(Schema.entries.userId, ownerId),
      ),
      with: { alarms: true },
    });

    return result.map((entry) => ({
      ...entry,
      startedAt: tools.DateFormatter.datetime(tools.Timestamp.fromNumber(entry.startedAt)),
    }));
  }
}

export const EntriesSharingOHQ = new EntriesSharingOHQDrizzle();
