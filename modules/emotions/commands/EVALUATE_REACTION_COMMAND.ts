import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

export const EVALUATE_REACTION_COMMAND = "EVALUATE_REACTION_COMMAND";

export const EvaluateReactionCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(EVALUATE_REACTION_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({
    entryId: VO.EntryId,
    newReaction: z.instanceof(Entities.Reaction),
    userId: Auth.VO.UserId,
  }),
});

export type EvaluateReactionCommandType = z.infer<typeof EvaluateReactionCommand>;
