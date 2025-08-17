import * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import type { TimeCapsuleDueEntriesPort, TimeCapsuleEntrySnapshot } from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class TimeCapsuleDueEntriesDrizzle implements TimeCapsuleDueEntriesPort {
  async listDue(now: tools.TimestampType): Promise<TimeCapsuleEntrySnapshot[]> {
    const rows = await db.query.timeCapsuleEntries.findMany({
      where: and(
        lte(Schema.timeCapsuleEntries.scheduledFor, now),
        eq(Schema.timeCapsuleEntries.status, VO.TimeCapsuleEntryStatusEnum.scheduled),
      ),
      limit: 10,
    });

    return rows as unknown as TimeCapsuleEntrySnapshot[];
  }
}
