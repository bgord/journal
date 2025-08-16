import * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onEmotionLoggedEvent =
  (HistoryWriter: bg.History.Services.HistoryWriterPort) =>
  async (event: Emotions.Events.EmotionLoggedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));

    await HistoryWriter.populate({
      operation: "entry.emotion.logged",
      subject: event.payload.entryId,
      payload: {
        emotionLabel: event.payload.label,
        emotionIntensity: event.payload.intensity as number,
      },
    });
  };
