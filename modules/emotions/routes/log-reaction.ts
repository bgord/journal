import * as Emotions from "+emotions";
import * as infra from "+infra";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function LogReaction(c: hono.Context, _next: hono.Next) {
  const body = await bg.safeParseBody(c);

  const emotionJournalEntryId = Emotions.VO.EmotionJournalEntryId.parse(c.req.param("id"));

  const reaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(body.effectiveness),
  );

  const command = Emotions.Commands.LogReactionCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.LOG_REACTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    payload: { emotionJournalEntryId, reaction },
  } satisfies Emotions.Commands.LogReactionCommandType);

  await infra.CommandBus.emit(command.name, command);

  return new Response();
}
