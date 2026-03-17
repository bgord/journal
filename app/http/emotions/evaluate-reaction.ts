import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as wip from "+infra/build";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.EvaluateReactionCommandType>;
};

export const EvaluateReaction = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const entryId = v.parse(Emotions.VO.EntryId, c.req.param("entryId"));

  const newReaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(body.description),
    new Emotions.VO.ReactionType(body.type),
    new Emotions.VO.ReactionEffectiveness(body.effectiveness),
  );

  const command = wip.command(
    Emotions.Commands.EvaluateReactionCommand,
    { revision, payload: { entryId, newReaction, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
