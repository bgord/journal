import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onEmotionReappraisedEvent = async (event: Emotions.Events.EmotionReappraisedEventType) => {
  await db
    .update(Schema.entries)
    .set({
      emotionLabel: event.payload.newLabel,
      emotionIntensity: event.payload.newIntensity as number,
      finishedAt: event.createdAt,
      revision: event.revision,
    })
    .where(eq(Schema.entries.id, event.payload.entryId));
};
