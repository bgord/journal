import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function EvaluateReaction(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const newReaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(body.effectiveness),
  );

  const command = Emotions.Commands.EvaluateReactionCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.EVALUATE_REACTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, newReaction },
  } satisfies Emotions.Commands.EvaluateReactionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
