import * as bg from "@bgord/bun";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function LogSituation(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const situation = new Emotions.Entities.Situation(
    new Emotions.VO.SituationDescription(body.description),
    new Emotions.VO.SituationLocation(body.location),
    new Emotions.VO.SituationKind(body.kind),
  );

  const id = bg.NewUUID.generate();

  infra.logger.info({
    message: "Log situation payload",
    operation: "read",
    metadata: { situation, id },
  });

  const entry = Emotions.Aggregates.EmotionJournalEntry.create(id);
  await entry.logSituation(situation);

  await infra.EventStore.save(entry.pullEvents());

  return new Response();
}
