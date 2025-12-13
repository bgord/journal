import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Emotions.Commands.EvaluateReactionCommandType>;
};

export const EvaluateReaction = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
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
    payload: { entryId, newReaction, userId },
  } satisfies Emotions.Commands.EvaluateReactionCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
