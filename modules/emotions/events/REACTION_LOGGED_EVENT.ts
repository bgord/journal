import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const REACTION_LOGGED_EVENT = "REACTION_LOGGED_EVENT";

export const ReactionLoggedEvent = z.object({
  ...BaseEventData,
  name: z.literal(REACTION_LOGGED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
    userId: Auth.VO.UserId,
  }),
});

export type ReactionLoggedEventType = z.infer<typeof ReactionLoggedEvent>;
