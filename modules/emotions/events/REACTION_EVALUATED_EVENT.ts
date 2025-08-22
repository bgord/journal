import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";

export const ReactionEvaluatedEvent = z.object({
  ...BaseEventData,
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
