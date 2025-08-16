import * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onEmotionReappraisedEvent =
  (HistoryWriter: bg.History.Services.HistoryWriterPort) =>
  async (event: Emotions.Events.EmotionReappraisedEventType) => {
    await db
      .update(Schema.entries)
      .set({
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
        finishedAt: event.createdAt,
        revision: event.revision,
      })
      .where(eq(Schema.entries.id, event.payload.entryId));

    await HistoryWriter.populate({
      operation: "entry.emotion.reappraised",
      subject: event.payload.entryId,
      payload: {
        emotionLabel: event.payload.newLabel,
        emotionIntensity: event.payload.newIntensity as number,
      },
    });
  };
