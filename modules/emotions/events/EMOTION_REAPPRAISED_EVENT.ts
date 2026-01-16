import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";

export const EmotionReappraisedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(EMOTION_REAPPRAISED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
    userId: Auth.VO.UserId,
  }),
});

export type EmotionReappraisedEventType = z.infer<typeof EmotionReappraisedEvent>;
