import * as Auth from "+auth";
import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";

export class EntryRepository {
  static async getByIdRaw(id: VO.EntryIdType) {
    const [result] = await db.select().from(Schema.entries).where(eq(Schema.entries.id, id));
    return result as Schema.SelectEntries;
  }

  static async getById(id: VO.EntryIdType): Promise<Schema.SelectEntriesFormatted | null> {
    const result = await db.select().from(Schema.entries).where(eq(Schema.entries.id, id));

    if (!result[0]) return null;

    return EntryRepository.format(result[0]);
  }

  static async findInWeek(weekStartedAt: number): Promise<Schema.SelectEntries[]> {
    const weekEndedAt = weekStartedAt + tools.Time.Days(7).ms;

    return db
      .select()
      .from(Schema.entries)
      .where(and(gte(Schema.entries.startedAt, weekStartedAt), lte(Schema.entries.startedAt, weekEndedAt)));
  }

  static async listForUser(userId: Auth.VO.UserIdType): Promise<Schema.SelectEntriesFull[]> {
    const entries = await db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
      with: { alarms: true },
    });

    return entries.map(EntryRepository.formatFull);
  }

  static async getCounts(userId: Auth.VO.UserIdType) {
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

  static async getTopEmotions(userId: Auth.VO.UserIdType) {
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

  static async topFiveEffective(userId: Auth.VO.UserIdType) {
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

  static async logSituation(event: Events.SituationLoggedEventType) {
    await db.insert(Schema.entries).values({
      id: event.payload.entryId,
      status: VO.EntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
      revision: event.revision,
      language: event.payload.language,
      userId: event.payload.userId,
    });
  }

  static async logEmotion(event: Events.EmotionLoggedEventType) {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  static async logReaction(event: Events.ReactionLoggedEventType) {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  static async reappraiseEmotion(event: Events.EmotionReappraisedEventType) {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  static async evaluateReaction(event: Events.ReactionEvaluatedEventType) {
    await db
      .update(Schema.entries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  static async deleteEntry(event: Events.EntryDeletedEventType) {
    await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));
  }

  static format(entry: Schema.SelectEntries): Schema.SelectEntriesFormatted {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }

  static formatFull(entry: Schema.SelectEntriesWithAlarms): Schema.SelectEntriesFull {
    return { ...entry, startedAt: tools.DateFormatters.datetime(entry.startedAt) };
  }
}
