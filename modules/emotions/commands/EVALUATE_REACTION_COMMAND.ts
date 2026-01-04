import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

// Stryker disable all
export const EVALUATE_REACTION_COMMAND = "EVALUATE_REACTION_COMMAND";
// Stryker restore all

export const EvaluateReactionCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(EVALUATE_REACTION_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({
    entryId: VO.EntryId,
    newReaction: z.instanceof(Entities.Reaction),
    userId: Auth.VO.UserId,
  }),
});

export type EvaluateReactionCommandType = z.infer<typeof EvaluateReactionCommand>;
