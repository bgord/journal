import type * as Events from "+emotions/events";
import * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";

export class TimeCapsuleEntryRepository {
  static async listDueForScheduling(now: tools.TimestampType) {
    return db.query.timeCapsuleEntries.findMany({
      where: and(
        lte(Schema.timeCapsuleEntries.scheduledFor, now),
        eq(Schema.timeCapsuleEntries.status, VO.TimeCapsuleEntryStatusEnum.scheduled),
      ),
      limit: 10,
    });
  }

  static async create(event: Events.TimeCapsuleEntryScheduledEventType) {
    await db.insert(Schema.timeCapsuleEntries).values({
      id: event.payload.entryId,
      scheduledAt: event.payload.scheduledAt,
      scheduledFor: event.payload.scheduledFor,
      situationKind: event.payload.situation.kind,
      situationDescription: event.payload.situation.description,
      situationLocation: event.payload.situation.location,
      emotionLabel: event.payload.emotion.label,
      emotionIntensity: event.payload.emotion.intensity as number,
      reactionDescription: event.payload.reaction.description,
      reactionType: event.payload.reaction.type,
      reactionEffectiveness: event.payload.reaction.effectiveness,
      language: event.payload.language,
      status: VO.TimeCapsuleEntryStatusEnum.scheduled,
      userId: event.payload.userId,
    });
  }

  static async publish(entryId: VO.EntryIdType) {
    await db
      .update(Schema.timeCapsuleEntries)
      .set({ status: VO.TimeCapsuleEntryStatusEnum.published })
      .where(eq(Schema.timeCapsuleEntries.id, entryId));
  }
}
