import type * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import type { TimeCapsuleDueEntriesPort, TimeCapsuleEntrySnapshot } from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class TimeCapsuleDueEntriesDrizzle implements TimeCapsuleDueEntriesPort {
  async listDue(now: tools.Timestamp) {
    const rows = await db.query.timeCapsuleEntries.findMany({
      where: and(
        lte(Schema.timeCapsuleEntries.scheduledFor, now.ms),
        eq(Schema.timeCapsuleEntries.status, VO.TimeCapsuleEntryStatusEnum.scheduled),
      ),
      limit: 10,
    });

    return rows as unknown as TimeCapsuleEntrySnapshot[];
  }
}

export const TimeCapsuleDueEntries = new TimeCapsuleDueEntriesDrizzle();
