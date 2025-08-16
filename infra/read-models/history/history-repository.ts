import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as History from "+history";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class HistoryRepository implements History.Repos.HistoryRepositoryPort {
  async append(data: History.VO.HistoryType, createdAt: tools.TimestampType) {
    await db.insert(Schema.history).values([{ ...data, createdAt }]);
  }

  async clear(subject: History.VO.HistoryType["subject"]) {
    await db.delete(Schema.history).where(eq(Schema.history.subject, subject));
  }
}
