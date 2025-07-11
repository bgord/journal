import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export class EntryRepository {
  static async getById(id: VO.EntryIdType): Promise<Schema.SelectEntries> {
    const result = await db.select().from(Schema.entries).where(eq(Schema.entries.id, id));

    return result[0] as Schema.SelectEntries;
  }

  static async countInWeek(weekStartedAt: number): Promise<number> {
    const weekEndedAt = weekStartedAt + tools.Time.Days(7).ms;

    return db.$count(
      Schema.entries,
      and(gte(Schema.entries.startedAt, weekStartedAt), lte(Schema.entries.startedAt, weekEndedAt)),
    );
  }

  static async findInWeek(weekStartedAt: number): Promise<Schema.SelectEntries[]> {
    const weekEndedAt = weekStartedAt + tools.Time.Days(7).ms;

    return db
      .select()
      .from(Schema.entries)
      .where(and(gte(Schema.entries.startedAt, weekStartedAt), lte(Schema.entries.startedAt, weekEndedAt)));
  }

  static async list(): Promise<Schema.SelectEntries[]> {
    return db.select().from(Schema.entries).orderBy(desc(Schema.entries.startedAt));
  }

  static async logSituation(event: Events.SituationLoggedEventType) {
    await db.insert(Schema.entries).values({
      id: event.payload.entryId,
      status: VO.EntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
    });
  }

  static async logEmotion(event: Events.EmotionLoggedEventType) {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
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
      })
      .where(eq(Schema.entries.id, event.payload.entryId));
  }

  static async deleteEntry(event: Events.EntryDeletedEventType) {
    await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));
  }
}
