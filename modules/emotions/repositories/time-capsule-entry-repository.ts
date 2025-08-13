import * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class TimeCapsuleEntryRepository {
  static async listDueForPublishing(now: tools.TimestampType) {
    return db.query.timeCapsuleEntries.findMany({
      where: and(
        lte(Schema.timeCapsuleEntries.scheduledFor, now),
        eq(Schema.timeCapsuleEntries.status, VO.TimeCapsuleEntryStatusEnum.scheduled),
      ),
      limit: 10,
    });
  }

  static async getById(entryId: VO.EntryIdType) {
    return db.query.timeCapsuleEntries.findFirst({ where: eq(Schema.timeCapsuleEntries.id, entryId) });
  }
}
