import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";

export const SituationLoggedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(SITUATION_LOGGED_EVENT),
  payload: v.object({
    entryId: VO.EntryId,
    description: VO.SituationDescriptionSchema,
    kind: VO.SituationKindSchema,
    userId: Auth.VO.UserId,
    origin: VO.EntryOrigin,
  }),
});

export type SituationLoggedEventType = v.InferOutput<typeof SituationLoggedEvent>;
