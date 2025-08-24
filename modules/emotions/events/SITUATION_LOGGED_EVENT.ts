import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";

export const SituationLoggedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(SITUATION_LOGGED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
    userId: Auth.VO.UserId,
    origin: VO.EntryOrigin,
  }),
});

export type SituationLoggedEventType = z.infer<typeof SituationLoggedEvent>;
