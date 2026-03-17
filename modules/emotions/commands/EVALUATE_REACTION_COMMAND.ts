import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const EVALUATE_REACTION_COMMAND = "EVALUATE_REACTION_COMMAND";
// Stryker restore all

export const EvaluateReactionCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EVALUATE_REACTION_COMMAND),
  revision: v.instance(tools.Revision),
  payload: v.object({
    entryId: VO.EntryId,
    newReaction: v.instance(Entities.Reaction),
    userId: Auth.VO.UserId,
  }),
});

export type EvaluateReactionCommandType = v.InferOutput<typeof EvaluateReactionCommand>;
