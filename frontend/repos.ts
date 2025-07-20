import * as tools from "@bgord/tools";
import { and, count, desc, eq, gte } from "drizzle-orm";
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

  static async getCounts(userId: UserIdType) {
    const todayStart = tools.Time.Now().Minus(tools.Time.Days(1)).ms;
    const weekStart = tools.Time.Now().Minus(tools.Time.Days(7)).ms;

    const [today] = await db
      .select({ c: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId), gte(Schema.entries.startedAt, todayStart)));

    const [week] = await db
      .select({ c: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId), gte(Schema.entries.startedAt, weekStart)));

    const [all] = await db
      .select({ c: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId));

    return { today: today?.c ?? 0, lastWeek: week?.c ?? 0, all: all?.c ?? 0 };
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms) {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
