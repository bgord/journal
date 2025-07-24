import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export class CountAlarmsForEntry {
  static async execute(entryId: VO.EntryIdType): Promise<number> {
    return db.$count(Schema.alarms, eq(Schema.alarms.entryId, entryId));
  }
}
