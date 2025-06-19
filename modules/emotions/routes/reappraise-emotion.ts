import * as bg from "@bgord/bun";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function ReappraiseEmotion(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const id = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  infra.logger.info({
    message: "Reappraise emotion payload",
    operation: "read",
    metadata: { emotion },
  });

  const history = await infra.EventStore.find(Emotions.Aggregates.EmotionJournalEntry.getStream(id));

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(id, history);

  await entry.reappraiseEmotion(emotion);

  const events = entry.pullEvents();
  await infra.EventStore.save(events);

  return new Response();
}
