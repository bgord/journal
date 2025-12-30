import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class HistoryReaderDrizzle implements bg.History.Ports.HistoryReaderPort {
  async read(subject: bg.History.VO.HistoryParsedType["subject"]): Promise<bg.History.VO.HistoryType[]> {
    const result = await db
      .select()
      .from(Schema.history)
      .where(eq(Schema.history.subject, subject))
      .orderBy(desc(Schema.history.createdAt))
      .limit(15);

    return result.map((entry) => ({
      ...entry,
      createdAt: tools.TimestampValue.parse(entry.createdAt),
      payload: entry.payload ? JSON.parse(entry.payload) : {},
    }));
  }
}

export const HistoryReader = new HistoryReaderDrizzle();
