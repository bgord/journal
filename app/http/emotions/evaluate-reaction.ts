import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Emotions.Commands.EvaluateReactionCommandType>;
};

export const EvaluateReaction = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();
  const body = await context.request.json();

  const userId = context.identity.userId() as bg.UUIDType;
  const entryId = v.parse(Emotions.VO.EntryId, params["entryId"]);
  const description = v.parse(Emotions.VO.ReactionDescriptionSchema, body["description"]);
  const type = v.parse(Emotions.VO.ReactionTypeSchema, body["type"]);
  const effectiveness = v.parse(Emotions.VO.ReactionEffectivenessSchema, body["effectiveness"]);

  const newReaction = new Emotions.Entities.Reaction(
    new Emotions.VO.ReactionDescription(description),
    new Emotions.VO.ReactionType(type),
    new Emotions.VO.ReactionEffectiveness(effectiveness),
  );

  const command = bg.command(
    Emotions.Commands.EvaluateReactionCommand,
    { revision: context.middleware.revision.fromWeakETag(), payload: { entryId, newReaction, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
