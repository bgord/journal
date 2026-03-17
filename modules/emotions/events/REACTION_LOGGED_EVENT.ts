import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const REACTION_LOGGED_EVENT = "REACTION_LOGGED_EVENT";

export const ReactionLoggedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(REACTION_LOGGED_EVENT),
  payload: v.object({
    entryId: VO.EntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
    userId: Auth.VO.UserId,
  }),
});

export type ReactionLoggedEventType = v.InferOutput<typeof ReactionLoggedEvent>;
