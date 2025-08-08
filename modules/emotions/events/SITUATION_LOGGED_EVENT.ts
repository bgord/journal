import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";
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
  revision: tools.RevisionValue.optional(),
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
