import { and, eq, notInArray } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class AlarmCancellationLookupDrizzle implements Emotions.Ports.AlarmCancellationLookupPort {
  async listIdsForEntry(entryId: Emotions.VO.EntryIdType) {
    const rows = await db
      .select({ id: Schema.alarms.id })
      .from(Schema.alarms)
      .where(
        and(
          eq(Schema.alarms.entryId, entryId),
          notInArray(Schema.alarms.status, [
            Emotions.VO.AlarmStatusEnum.cancelled,
            Emotions.VO.AlarmStatusEnum.notification_requested,
          ]),
        ),
      );

    return rows.map((row) => row.id);
  }
}

export const AlarmCancellationLookup = new AlarmCancellationLookupDrizzle();
