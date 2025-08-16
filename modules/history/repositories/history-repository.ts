import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as History from "+history";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export interface HistoryRepositoryPort {
  append(data: History.VO.HistoryType, createdAt: tools.TimestampType): Promise<void>;

  clear(correlationId: History.VO.HistoryType["correlationId"]): Promise<void>;
}

export class HistoryRepository implements HistoryRepositoryPort {
  async append(data: History.VO.HistoryType, createdAt: tools.TimestampType) {
    await db.insert(Schema.history).values([{ ...data, createdAt }]);
  }

  async clear(correlationId: History.VO.HistoryType["correlationId"]) {
    await db.delete(Schema.history).where(eq(Schema.history.correlationId, correlationId));
  }
}
