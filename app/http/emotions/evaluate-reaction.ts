import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider, Clock };

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
    ...bg.createCommandEnvelope(deps),
    name: Emotions.Commands.EVALUATE_REACTION_COMMAND,
    revision,
    payload: { entryId, newReaction, userId: user.id },
  } satisfies Emotions.Commands.EvaluateReactionCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
