import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import * as Schema from "../infra/schema";
import { db } from "./db";

export class Repo {
  static async listEntriesForUser(userId: string) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
      with: { alarms: true },
    });

    return entries.map(Repo.formatFull);
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms): Schema.SelectEntriesFull {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
