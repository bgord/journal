import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const TIME_CAPSULE_ENTRY_SCHEDULED_EVENT = "TIME_CAPSULE_ENTRY_SCHEDULED_EVENT";

export const TimeCapsuleEntryScheduledEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(TIME_CAPSULE_ENTRY_SCHEDULED_EVENT),
  payload: v.object({
    entryId: VO.EntryId,
    userId: Auth.VO.UserId,

    scheduledAt: tools.TimestampValue,
    scheduledFor: tools.TimestampValue,

    situation: v.object({ description: VO.SituationDescriptionSchema, kind: VO.SituationKindSchema }),
    emotion: v.object({ label: VO.EmotionLabelSchema, intensity: VO.EmotionIntensitySchema }),
    reaction: v.object({
      type: VO.ReactionTypeSchema,
      effectiveness: VO.ReactionEffectivenessSchema,
      description: VO.ReactionDescriptionSchema,
    }),
  }),
});

export type TimeCapsuleEntryScheduledEventType = v.InferOutput<typeof TimeCapsuleEntryScheduledEvent>;
