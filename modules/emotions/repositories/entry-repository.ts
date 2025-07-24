import * as Auth from "+auth";
import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, lte } from "drizzle-orm";

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

  static async listForUser(userId: Auth.VO.UserIdType) {
    return db.query.entries.findMany({
      orderBy: desc(Schema.entries.startedAt),
      where: eq(Schema.entries.userId, userId),
    });
  }

  static async findInWeekForUser(
    week: tools.Week,
    userId: Auth.VO.UserIdType,
  ): Promise<Schema.SelectEntries[]> {
    return db
      .select()
      .from(Schema.entries)
      .where(
        and(
          gte(Schema.entries.startedAt, week.getStart()),
          lte(Schema.entries.startedAt, week.getEnd()),
          eq(Schema.entries.userId, userId),
        ),
      );
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
