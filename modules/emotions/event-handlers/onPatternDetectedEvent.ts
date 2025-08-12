import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onPatternDetectedEvent = async (event: Emotions.Services.Patterns.PatternDetectionEventType) => {
  await db.insert(Schema.patternDetections).values({
    id: event.id,
    name: event.payload.name,
    userId: event.payload.userId,
    createdAt: event.createdAt,
    weekIsoId: event.payload.weekIsoId,
  });
};
