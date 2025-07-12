import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";

export const SituationLoggedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(SITUATION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    entryId: VO.EntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
  }),
});

export type SituationLoggedEventType = z.infer<typeof SituationLoggedEvent>;
