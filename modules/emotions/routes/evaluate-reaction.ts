import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { CommandBus } from "+infra/command-bus";

export async function EvaluateReaction(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));

  const newReaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(Number(body.effectiveness)),
  );

  const command = Emotions.Commands.EvaluateReactionCommand.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    name: Emotions.Commands.EVALUATE_REACTION_COMMAND,
    createdAt: tools.Time.Now().value,
    revision,
    payload: { entryId, newReaction, userId: user.id },
  } satisfies Emotions.Commands.EvaluateReactionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
