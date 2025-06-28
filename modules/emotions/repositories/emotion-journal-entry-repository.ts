import { eq, gte, and, lte } from "drizzle-orm";
import { db } from "../../../infra/db";
import * as tools from "@bgord/tools";
import * as Schema from "../../../infra/schema";
import type * as Events from "../events";
import * as VO from "../value-objects";

export class EmotionJournalEntryRepository {
  static async getById(id: VO.EmotionJournalEntryIdType): Promise<Schema.SelectEmotionJournalEntries> {
    const result = await db
      .select()
      .from(Schema.emotionJournalEntries)
      .where(eq(Schema.emotionJournalEntries.id, id));

    return result[0] as Schema.SelectEmotionJournalEntries;
  }

  static async countInWeek(weekStartedAt: number): Promise<number> {
    const weekEndedAt = weekStartedAt + tools.Time.Days(7).ms;

    return db.$count(
      Schema.emotionJournalEntries,
      and(
        gte(Schema.emotionJournalEntries.startedAt, weekStartedAt),
        lte(Schema.emotionJournalEntries.startedAt, weekEndedAt),
      ),
    );
  }

  static async logSituation(event: Events.SituationLoggedEventType) {
    await db.insert(Schema.emotionJournalEntries).values({
      id: event.payload.emotionJournalEntryId,
      status: VO.EmotionJournalEntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
    });
  }

  static async logEmotion(event: Events.EmotionLoggedEventType) {
    await db
      .update(Schema.emotionJournalEntries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
      })
      .where(eq(Schema.emotionJournalEntries.id, event.payload.emotionJournalEntryId));
  }

  static async logReaction(event: Events.ReactionLoggedEventType) {
    await db
      .update(Schema.emotionJournalEntries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
      })
      .where(eq(Schema.emotionJournalEntries.id, event.payload.emotionJournalEntryId));
  }

  static async reappraiseEmotion(event: Events.EmotionReappraisedEventType) {
    await db
      .update(Schema.emotionJournalEntries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
        finishedAt: event.createdAt,
      })
      .where(eq(Schema.emotionJournalEntries.id, event.payload.emotionJournalEntryId));
  }

  static async evaluateReaction(event: Events.ReactionEvaluatedEventType) {
    await db
      .update(Schema.emotionJournalEntries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
      })
      .where(eq(Schema.emotionJournalEntries.id, event.payload.emotionJournalEntryId));
  }

  static async deleteEntry(event: Events.EmotionJournalEntryDeletedEventType) {
    await db
      .delete(Schema.emotionJournalEntries)
      .where(eq(Schema.emotionJournalEntries.id, event.payload.emotionJournalEntryId));
  }
}
