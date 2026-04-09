import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class HistoryProjectionDrizzle implements bg.History.Ports.HistoryProjectionPort {
  async append(data: bg.History.VO.HistoryParsedType): Promise<void> {
    await db.insert(Schema.history).values([data]);
  }

  async clear(subject: bg.History.VO.HistoryParsedType["subject"]): Promise<void> {
    await db.delete(Schema.history).where(eq(Schema.history.subject, subject));
  }
}

export const HistoryProjection = new HistoryProjectionDrizzle();
