import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";

export const ReactionEvaluatedEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(REACTION_EVALUATED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
    userId: Auth.VO.UserId,
  }),
});

export type ReactionEvaluatedEventType = z.infer<typeof ReactionEvaluatedEvent>;
