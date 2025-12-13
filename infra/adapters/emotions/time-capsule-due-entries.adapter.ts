import type * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class TimeCapsuleDueEntriesDrizzle implements Emotions.Ports.TimeCapsuleDueEntriesPort {
  async listDue(now: tools.Timestamp) {
    const rows = await db.query.timeCapsuleEntries.findMany({
      where: and(
        lte(Schema.timeCapsuleEntries.scheduledFor, now.ms),
        eq(Schema.timeCapsuleEntries.status, Emotions.VO.TimeCapsuleEntryStatusEnum.scheduled),
      ),
      limit: 10,
    });

    return rows as unknown as Emotions.Ports.TimeCapsuleEntrySnapshot[];
  }
}

export const TimeCapsuleDueEntries = new TimeCapsuleDueEntriesDrizzle();
