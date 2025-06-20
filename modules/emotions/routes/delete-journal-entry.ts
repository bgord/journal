import * as bg from "@bgord/bun";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function DeleteJournalEntry(_c: hono.Context, _next: hono.Next) {
  const id = bg.NewUUID.generate();

  infra.logger.info({
    message: "Delete journal entry payload",
    operation: "read",
    metadata: { id },
  });

  const entry = Emotions.Aggregates.EmotionJournalEntry.create(id);
  await entry.delete();

  await infra.EventStore.save(entry.pullEvents());

  return new Response();
}
