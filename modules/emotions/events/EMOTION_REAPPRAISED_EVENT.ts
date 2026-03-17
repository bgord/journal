import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";

export const EmotionReappraisedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EMOTION_REAPPRAISED_EVENT),
  payload: v.object({
    entryId: VO.EntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
    userId: Auth.VO.UserId,
  }),
});

export type EmotionReappraisedEventType = v.InferOutput<typeof EmotionReappraisedEvent>;
