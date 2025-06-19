import * as bg from "@bgord/bun";
import hono from "hono";
import * as infra from "../../../infra";
import * as Emotions from "../";

export async function EvaluateReaction(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const id = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(body.effectiveness),
  );

  infra.logger.info({
    message: "Evaluate reaction payload",
    operation: "read",
    metadata: { reaction },
  });

  const history = await infra.EventStore.find(
    Emotions.Aggregates.EmotionJournalEntry.events,
    Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  );

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(id, history);
  await entry.evaluateReaction(reaction);

  await infra.EventStore.save(entry.pullEvents());

  return new Response();
}
