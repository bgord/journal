import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import * as History from "+history";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onEntryDeletedEvent =
  (HistoryWriter: History.Services.HistoryWriterPort) =>
  async (event: Emotions.Events.EntryDeletedEventType) => {
    await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));

    await HistoryWriter.clear(event.payload.entryId);
  };
