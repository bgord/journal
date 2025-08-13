import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onEntryDeletedEvent = async (event: Emotions.Events.EntryDeletedEventType) => {
  await db.delete(Schema.entries).where(eq(Schema.entries.id, event.payload.entryId));
};
