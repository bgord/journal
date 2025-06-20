import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function DeleteJournalEntry(c: hono.Context, _next: hono.Next) {
  const id = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  infra.logger.info({
    message: "Delete journal entry payload",
    operation: "read",
    metadata: { id },
  });

  const history = await infra.EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(id, history);
  await entry.delete();

  await infra.EventStore.save(entry.pullEvents());

  return new Response();
}
