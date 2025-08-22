import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import { SupportedLanguages } from "+languages";
import * as VO from "+emotions/value-objects";

export const SITUATION_LOGGED_EVENT = "SITUATION_LOGGED_EVENT";

export const SituationLoggedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(SITUATION_LOGGED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    description: VO.SituationDescriptionSchema,
    location: VO.SituationLocationSchema,
    kind: VO.SituationKindSchema,
    language: z.enum(SupportedLanguages),
    userId: Auth.VO.UserId,
    origin: VO.EntryOrigin,
  }),
});

export type SituationLoggedEventType = z.infer<typeof SituationLoggedEvent>;
