import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onEmotionLoggedEvent = async (event: Emotions.Events.EmotionLoggedEventType) => {
  await db
    .update(Schema.entries)
    .set({
      emotionLabel: event.payload.label,
      emotionIntensity: event.payload.intensity as number,
      revision: event.revision,
    })
    .where(eq(Schema.entries.id, event.payload.entryId));
};
