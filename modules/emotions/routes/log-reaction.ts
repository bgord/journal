import * as bg from "@bgord/bun";
import hono from "hono";

import * as Emotions from "../";
import * as infra from "../../../infra";

export async function LogReaction(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const id = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(body.effectiveness),
  );

  infra.logger.info({
    message: "Log reaction payload",
    operation: "read",
    metadata: { reaction },
  });

  const history = await infra.EventStore.find(Emotions.Aggregates.EmotionJournalEntry.getStream(id));

  const entry = Emotions.Aggregates.EmotionJournalEntry.build(id, history);

  await entry.logReaction(reaction);

  return new Response();
}
