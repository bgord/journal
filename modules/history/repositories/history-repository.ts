import { eq } from "drizzle-orm";
import * as Events from "+history/events";
import * as VO from "+history/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class HistoryRepository {
  static async append(event: Events.HistoryPopulatedEventType) {
    const data = VO.History.parse(event.payload);
    await db.insert(Schema.history).values([{ ...data, createdAt: event.createdAt }]);
  }

  static async clear(event: Events.HistoryClearedEventType) {
    await db.delete(Schema.history).where(eq(Schema.history.correlationId, event.payload.correlationId));
  }
}
