import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onReactionLoggedEvent = async (event: Emotions.Events.ReactionLoggedEventType) => {
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
