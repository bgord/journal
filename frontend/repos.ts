import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import * as Schema from "../infra/schema";
import type { UserIdType } from "../modules/auth/value-objects/user-id";
import type { EmotionLabelType } from "../modules/emotions/value-objects/emotion-label";
import { EmotionLabel } from "../modules/emotions/value-objects/emotion-label";
import { db } from "./db";

export class Repo {
  static async listEntriesForUser(userId: UserIdType) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
      with: { alarms: true },
    });

    return entries.map(Repo.formatFull);
  }

  static async getHeatmap(userId: UserIdType) {
    const rows = await db
      .select({ label: Schema.entries.emotionLabel })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId))
      .orderBy(desc(Schema.entries.startedAt));

    return rows.map((row) => (new EmotionLabel(row.label as EmotionLabelType).isPositive() ? 1 : 0));
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms): Schema.SelectEntriesFull {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
