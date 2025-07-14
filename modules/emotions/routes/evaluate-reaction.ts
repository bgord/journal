import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";

export async function EvaluateReaction(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const body = await bg.safeParseBody(c);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const entryId = Emotions.VO.EntryId.parse(c.req.param("id"));

  const newReaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(Number(body.effectiveness)),
  );

  const command = Emotions.Commands.EvaluateReactionCommand.parse({
    id: bg.NewUUID.generate(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.EVALUATE_REACTION_COMMAND,
    createdAt: tools.Timestamp.parse(Date.now()),
    revision,
    payload: { entryId, newReaction },
  } satisfies Emotions.Commands.EvaluateReactionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
