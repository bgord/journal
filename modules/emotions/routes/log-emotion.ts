import * as bg from "@bgord/bun";
import hono from "hono";

import * as Emotions from "../";
import * as infra from "../../../infra";

export async function LogEmotion(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotion = new Emotions.Entities.Emotion(
    new Emotions.VO.EmotionLabel(body.label),
    new Emotions.VO.EmotionIntensity(body.intensity),
  );

  infra.logger.info({
    message: "Emotion payload",
    operation: "read",
    metadata: { emotion },
  });

  const id = bg.NewUUID.generate();
  const entry = Emotions.Aggregates.EmotionJournalEntry.create(id);

  await entry.logEmotion(emotion);

  return new Response();
}
