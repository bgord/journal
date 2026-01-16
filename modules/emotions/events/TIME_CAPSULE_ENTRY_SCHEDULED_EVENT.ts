import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const TIME_CAPSULE_ENTRY_SCHEDULED_EVENT = "TIME_CAPSULE_ENTRY_SCHEDULED_EVENT";

export const TimeCapsuleEntryScheduledEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(TIME_CAPSULE_ENTRY_SCHEDULED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    userId: Auth.VO.UserId,

    scheduledAt: tools.TimestampValue,
    scheduledFor: tools.TimestampValue,

    situation: z.object({ description: VO.SituationDescriptionSchema, kind: VO.SituationKindSchema }),
    emotion: z.object({ label: VO.EmotionLabelSchema, intensity: VO.EmotionIntensitySchema }),
    reaction: z.object({
      type: VO.ReactionTypeSchema,
      effectiveness: VO.ReactionEffectivenessSchema,
      description: VO.ReactionDescriptionSchema,
    }),
  }),
});

export type TimeCapsuleEntryScheduledEventType = z.infer<typeof TimeCapsuleEntryScheduledEvent>;
