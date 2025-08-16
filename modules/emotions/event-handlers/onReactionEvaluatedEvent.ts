import * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onReactionEvaluatedEvent =
  (HistoryWriter: bg.History.Services.HistoryWriterPort) =>
  async (event: Emotions.Events.ReactionEvaluatedEventType) => {
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

    await HistoryWriter.populate({
      operation: "entry.reaction.evaluated",
      subject: event.payload.entryId,
      payload: {
        description: event.payload.description,
        type: event.payload.type,
        effectiveness: event.payload.effectiveness,
      },
    });
  };
