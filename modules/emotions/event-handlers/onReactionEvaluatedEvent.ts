import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onReactionEvaluatedEvent = async (event: Emotions.Events.ReactionEvaluatedEventType) => {
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
};
