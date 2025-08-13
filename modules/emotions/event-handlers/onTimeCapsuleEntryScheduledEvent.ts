import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onTimeCapsuleEntryScheduledEvent = async (
  event: Emotions.Events.TimeCapsuleEntryScheduledEventType,
) => {
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
    status: Emotions.VO.TimeCapsuleEntryStatusEnum.scheduled,
    userId: event.payload.userId,
  });
};
