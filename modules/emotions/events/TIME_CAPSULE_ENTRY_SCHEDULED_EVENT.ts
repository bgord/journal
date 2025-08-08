import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const TIME_CAPSULE_ENTRY_SCHEDULED_EVENT = "TIME_CAPSULE_ENTRY_SCHEDULED_EVENT";

export const TimeCapsuleEntryScheduledEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(TIME_CAPSULE_ENTRY_SCHEDULED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    entryId: VO.EntryId,
    language: z.enum(SupportedLanguages),
    userId: Auth.VO.UserId,

    scheduledAt: tools.Timestamp,
    scheduledFor: tools.Timestamp,

    situation: z.object({
      description: VO.SituationDescriptionSchema,
      location: VO.SituationLocationSchema,
      kind: VO.SituationKindSchema,
    }),
    emotion: z.object({
      label: VO.EmotionLabelSchema,
      intensity: VO.EmotionIntensitySchema,
    }),
    reaction: z.object({
      type: VO.ReactionTypeSchema,
      effectiveness: VO.ReactionEffectivenessSchema,
      description: VO.ReactionDescriptionSchema,
    }),
  }),
});

export type TimeCapsuleEntryScheduledEventType = z.infer<typeof TimeCapsuleEntryScheduledEvent>;
