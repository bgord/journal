import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class HistoryProjectionDrizzle implements bg.History.Repos.HistoryRepositoryPort {
  async append(data: bg.History.VO.HistoryParsedType, createdAt: tools.TimestampType) {
    await db.insert(Schema.history).values([{ ...data, createdAt }]);
  }

  async clear(subject: bg.History.VO.HistoryParsedType["subject"]) {
    await db.delete(Schema.history).where(eq(Schema.history.subject, subject));
  }
}

export const HistoryProjection = new HistoryProjectionDrizzle();
