import * as tools from "@bgord/tools";
import { and, count, desc, eq, getTableColumns, gte, like, not, or, type SQL, sql } from "drizzle-orm";
import { AddEntryForm } from "../app/services/add-entry-form";
import { AuthForm } from "../app/services/auth-form";
import { CreateShareableLinkForm } from "../app/services/create-shareable-link-form";
import * as Schema from "../infra/schema";
import type { UserIdType } from "../modules/auth/value-objects/user-id";
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import type { EmotionIntensityType } from "../modules/emotions/value-objects/emotion-intensity";
import { EmotionIntensity } from "../modules/emotions/value-objects/emotion-intensity";
import type { EmotionLabelType } from "../modules/emotions/value-objects/emotion-label";
import { EmotionLabel } from "../modules/emotions/value-objects/emotion-label";
import type { EntryIdType } from "../modules/emotions/value-objects/entry-id";
import { db } from "./db";

export class ReadModel {
  static AddEntryForm = AddEntryForm.get();

  static AuthForm = AuthForm.get();

  static CreateShareableLinkForm = CreateShareableLinkForm.get();

  static async listEntriesForUser(
    userId: UserIdType,
    offsetMs: number,
    filter?: string | null,
    search?: string | null,
  ) {
    const where = [eq(Schema.entries.userId, userId)];

    const now = Date.now() as tools.TimestampType;

    if (filter === "today") {
      where.push(gte(Schema.entries.startedAt, tools.Time.Now(now).Minus(tools.Duration.Days(1))));
    }

    if (filter === "last_week") {
      where.push(gte(Schema.entries.startedAt, tools.Time.Now(now).Minus(tools.Duration.Days(7))));
    }

    if (filter === "last_month") {
      where.push(gte(Schema.entries.startedAt, tools.Time.Now(now).Minus(tools.Duration.Days(30))));
    }

    if (search?.trim()) {
      const pattern = `%${search.trim()}%`;

      const clauses: SQL[] = [
        Schema.entries.situationDescription,
        Schema.entries.reactionDescription,
        Schema.entries.emotionLabel,
      ].map((col) => like(col, pattern));

      where.push(or(...clauses) as SQL<unknown>);
    }

    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: and(...where),
      with: { alarms: true },
    });

    return entries.map((entry) => ReadModel.formatFull(entry, offsetMs));
  }

  static async getHeatmap(userId: UserIdType) {
    const rows = await db
      .select({ label: Schema.entries.emotionLabel, intensity: Schema.entries.emotionIntensity })
      .from(Schema.entries)
      .where(eq(Schema.entries.userId, userId))
      .orderBy(desc(Schema.entries.startedAt));

    return rows.map((row) => {
      const label = new EmotionLabel(row.label as EmotionLabelType);
      const intensity = new EmotionIntensity(row.intensity as EmotionIntensityType);

      return {
        t: label.isPositive() ? 1 : 0,
        c: intensity.isExtreme() ? "600" : intensity.isIntensive() ? "400" : "200",
      };
    });
  }

  static async getEntryCounts(userId: UserIdType) {
    const now = Date.now() as tools.TimestampType;

    const todayStart = tools.Time.Now(now).Minus(tools.Duration.Days(1));
    const weekStart = tools.Time.Now(now).Minus(tools.Duration.Days(7));

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
    const now = Date.now() as tools.TimestampType;

    const todayStart = tools.Time.Now(now).Minus(tools.Duration.Days(1));
    const weekStart = tools.Time.Now(now).Minus(tools.Duration.Days(7));

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
        id: Schema.entries.id,
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
      where: and(
        eq(Schema.alarms.userId, userId),
        eq(Schema.alarms.name, AlarmNameOption.INACTIVITY_ALARM),
        not(eq(Schema.alarms.status, "cancelled")),
      ),
      orderBy: desc(Schema.alarms.generatedAt),
      limit: 5,
    });

    const entry = await db.query.alarms.findMany({
      where: and(
        eq(Schema.alarms.userId, userId),
        not(eq(Schema.alarms.name, AlarmNameOption.INACTIVITY_ALARM)),
        not(eq(Schema.alarms.status, "cancelled")),
      ),
      orderBy: desc(Schema.alarms.generatedAt),
      limit: 5,
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

  static async listShareableLinks(userId: UserIdType) {
    const totalHitsExpr = sql<number>`COUNT(*)`.as("totalHits");
    const uniqueVisitorsExpr = sql<number>`COUNT(DISTINCT ${Schema.shareableLinkHits.visitorId})`.as(
      "uniqueVisitors",
    );

    const hits = db
      .select({
        shareableLinkId: Schema.shareableLinkHits.shareableLinkId,
        totalHits: totalHitsExpr,
        uniqueVisitors: uniqueVisitorsExpr,
      })
      .from(Schema.shareableLinkHits)
      .where(eq(Schema.shareableLinkHits.ownerId, userId))
      .groupBy(Schema.shareableLinkHits.shareableLinkId)
      .as("hitsAgg");

    const rows = await db
      .select({
        ...getTableColumns(Schema.shareableLinks),
        totalHits: sql<number>`COALESCE(${hits.totalHits}, 0)`.as("totalHits"),
        uniqueVisitors: sql<number>`COALESCE(${hits.uniqueVisitors}, 0)`.as("uniqueVisitors"),
      })
      .from(Schema.shareableLinks)
      .leftJoin(hits, eq(hits.shareableLinkId, Schema.shareableLinks.id))
      .where(and(eq(Schema.shareableLinks.ownerId, userId), eq(Schema.shareableLinks.hidden, false)))
      .orderBy(
        sql`CASE ${Schema.shareableLinks.status} WHEN 'active' THEN 0 ELSE 1 END`,
        desc(Schema.shareableLinks.createdAt),
      )
      .limit(5);

    return rows.map((rows) => ({
      ...rows,
      dateRangeStart: tools.DateFormatters.datetime(rows.dateRangeStart),
      dateRangeEnd: tools.DateFormatters.datetime(rows.dateRangeEnd),
      expiresAt: tools.DateFormatters.datetime(rows.expiresAt),
      updatedAt: tools.DateFormatters.datetime(rows.updatedAt),
    }));
  }

  static async listWeeklyReviews(userId: UserIdType) {
    const reviews = await db.query.weeklyReviews.findMany({
      where: eq(Schema.weeklyReviews.userId, userId),
      orderBy: desc(Schema.weeklyReviews.createdAt),
      with: {
        entries: { columns: { id: true } },
        patternDetections: {
          columns: { id: true, name: true },
          orderBy: desc(Schema.patternDetections.createdAt),
        },
        alarms: { columns: { id: true, name: true }, orderBy: desc(Schema.alarms.generatedAt) },
      },
      limit: 5,
    });

    return reviews.map((review) => ({
      ...review,
      entryCount: review.entries.length,
      week: tools.Week.fromIsoId(review.weekIsoId).toRange().map(tools.DateFormatters.datetime),
    }));
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms, offsetMs: number) {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt + offsetMs) };
  }

  static async hideShareableLink(linkId: Schema.SelectShareableLinks["id"]) {
    await db.update(Schema.shareableLinks).set({ hidden: true }).where(eq(Schema.shareableLinks.id, linkId));
  }

  static async getAiUsageToday(userId: UserIdType) {
    const now = Date.now() as tools.TimestampType;
    const day = tools.Day.fromNow(now);

    const bucket = `user:${userId}:day:${day.toIsoId()}`;

    const result = await db.query.aiUsageCounters.findFirst({
      columns: { count: true },
      where: and(eq(Schema.aiUsageCounters.bucket, bucket)),
    });

    const count = result?.count ?? 0;
    const limit = 10;

    const resetsInHours = tools.Duration.Ms(day.getEnd() - now).hours;

    return {
      consumed: count >= limit,
      limit,
      count,
      remaining: limit - count,
      resetsIn: new tools.RoundToNearest().round(resetsInHours),
    };
  }

  static async listHistoryForEntry(entryId: EntryIdType) {
    const history = await db.query.history.findMany({
      where: eq(Schema.history.subject, entryId),
      orderBy: desc(Schema.history.createdAt),
    });

    return history.map((entry) => ({
      ...entry,
      createdAt: tools.DateFormatters.datetime(entry.createdAt),
      payload: entry.payload ? JSON.parse(entry.payload) : {},
    }));
  }
}
