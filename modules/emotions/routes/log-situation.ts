import * as bg from "@bgord/bun";
import hono from "hono";

import * as Emotions from "../";
import * as infra from "../../../infra";

export async function LogSituation(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.description),
    new Emotions.VO.SituationLocation(body.location),
    new Emotions.VO.SituationKind(body.kind),
  );

  infra.logger.info({
    message: "Log situation payload",
    operation: "read",
    metadata: { situation },
  });

  const id = bg.NewUUID.generate();
  const entry = Emotions.Aggregates.EmotionJournalEntry.create(id);

  await entry.logSituation(situation);

  return new Response();
}
