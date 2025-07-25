import * as tools from "@bgord/tools";
import { and, count, desc, eq, gte, not, sql } from "drizzle-orm";
import { AddEntryForm } from "../app/services/add-entry-form";
import { AuthForm } from "../app/services/auth-form";
import * as Schema from "../infra/schema";
import type { UserIdType } from "../modules/auth/value-objects/user-id";
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import type { EmotionLabelType } from "../modules/emotions/value-objects/emotion-label";
import { EmotionLabel } from "../modules/emotions/value-objects/emotion-label";
import { db } from "./db";

export class ReadModel {
  static AddEntryForm = AddEntryForm.get();

  static AuthForm = AuthForm.get();

  static async listEntriesForUser(userId: UserIdType) {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
      with: { alarms: true },
    });

    return entries.map(ReadModel.formatFull);
  }

  static async getHeatmap(userId: UserIdType) {
    const rows = await db
      .select({ label: Schema.entries.emotionLabel })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId))
      .orderBy(desc(Schema.entries.startedAt));

    return rows.map((row) => (new EmotionLabel(row.label as EmotionLabelType).isPositive() ? 1 : 0));
  }

  static async getEntryCounts(userId: UserIdType) {
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

  static async getTopEmotions(userId: UserIdType) {
    const todayStart = tools.Time.Now().Minus(tools.Time.Days(1)).ms;
    const weekStart = tools.Time.Now().Minus(tools.Time.Days(7)).ms;

    const today = await db
      .select({ label: Schema.entries.emotionLabel, hits: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId), gte(Schema.entries.startedAt, todayStart)))
      .groupBy(Schema.entries.emotionLabel)
      .orderBy(sql`count(${Schema.entries.id}) DESC`)
      .limit(3);

    const lastWeek = await db
      .select({ label: Schema.entries.emotionLabel, hits: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId), gte(Schema.entries.startedAt, weekStart)))
      .groupBy(Schema.entries.emotionLabel)
      .orderBy(sql`count(${Schema.entries.id}) DESC`)
      .limit(3);

    const all = await db
      .select({ label: Schema.entries.emotionLabel, hits: count(Schema.entries.id).mapWith(Number) })
      .from(Schema.entries)
      .where(and(eq(Schema.entries.userId, userId)))
      .groupBy(Schema.entries.emotionLabel)
      .orderBy(sql`count(${Schema.entries.id}) DESC`)
      .limit(3);

    return { today, lastWeek, all };
  }

  static async getTopReactions(userId: UserIdType) {
    return db
      .select({
        reactionDescription: Schema.entries.reactionDescription,
        reactionType: Schema.entries.reactionType,
        reactionEffectiveness: Schema.entries.reactionEffectiveness,
      })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId))
      .orderBy(desc(Schema.entries.reactionEffectiveness))
      .limit(5);
  }

  static async listAlarms(userId: UserIdType) {
    const inactivity = await db.query.alarms.findMany({
      where: and(eq(Schema.alarms.userId, userId), eq(Schema.alarms.name, AlarmNameOption.INACTIVITY_ALARM)),
    });

    const entry = await db.query.alarms.findMany({
      where: and(
        eq(Schema.alarms.userId, userId),
        not(eq(Schema.alarms.name, AlarmNameOption.INACTIVITY_ALARM)),
      ),
    });

    return {
      inactivity: inactivity.map((alarm) => ({
        ...alarm,
        generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
      })),
      entry: entry.map((alarm) => ({
        ...alarm,
        generatedAt: tools.DateFormatters.datetime(alarm.generatedAt),
      })),
    };
  }

  static async listWeeklyReviews(userId: UserIdType) {
    const rows = await db
      .select({
        id: Schema.weeklyReviews.id,
        createdAt: Schema.weeklyReviews.createdAt,
        weekIsoId: Schema.weeklyReviews.weekIsoId,
        insights: Schema.weeklyReviews.insights,
        status: Schema.weeklyReviews.status,
        entryCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${Schema.entries} 
          WHERE ${Schema.entries.weekIsoId} = ${Schema.weeklyReviews.weekIsoId}
            AND ${Schema.entries.userId}    = ${userId}
        )`.mapWith(Number),
      })
      .from(Schema.weeklyReviews)
      .where(eq(Schema.weeklyReviews.userId, userId))
      .orderBy(desc(Schema.weeklyReviews.createdAt));

    return rows.map((row) => ({
      ...row,
      week: tools.Week.fromIsoId(row.weekIsoId).toRange().map(tools.DateFormatters.datetime),
    }));
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms) {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
