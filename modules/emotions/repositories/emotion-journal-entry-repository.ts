import { eq } from "drizzle-orm";
import * as infra from "../../../infra";
import * as Events from "../events";
import * as VO from "../value-objects";

export class EmotionJournalEntryRepository {
  static async logSituation(event: Events.SituationLoggedEventType) {
    await infra.db.insert(infra.Schema.emotionJournalEntries).values({
      id: event.payload.id,
      status: VO.EmotionJournalEntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
    });
  }

  static async logEmotion(event: Events.EmotionLoggedEventType) {
    await infra.db
      .update(infra.Schema.emotionJournalEntries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
      })
      .where(eq(infra.Schema.emotionJournalEntries.id, event.payload.id));
  }

  static async logReaction(event: Events.ReactionLoggedEventType) {
    await infra.db
      .update(infra.Schema.emotionJournalEntries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
      })
      .where(eq(infra.Schema.emotionJournalEntries.id, event.payload.id));
  }

  static async reappraiseEmotion(event: Events.EmotionReappraisedEventType) {
    await infra.db
      .update(infra.Schema.emotionJournalEntries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
        finishedAt: event.createdAt,
      })
      .where(eq(infra.Schema.emotionJournalEntries.id, event.payload.id));
  }

  static async evaluateReaction(event: Events.ReactionEvaluatedEventType) {
    await infra.db
      .update(infra.Schema.emotionJournalEntries)
      .set({
        reactionDescription: event.payload.description,
        reactionType: event.payload.type,
        reactionEffectiveness: event.payload.effectiveness,
        finishedAt: event.createdAt,
      })
      .where(eq(infra.Schema.emotionJournalEntries.id, event.payload.id));
  }

  static async deleteEntry(event: Events.EmotionJournalEntryDeletedEventType) {
    await infra.db
      .delete(infra.Schema.emotionJournalEntries)
      .where(eq(infra.Schema.emotionJournalEntries.id, event.payload.id));
  }
}
