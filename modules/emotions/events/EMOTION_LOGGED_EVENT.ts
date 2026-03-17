import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EMOTION_LOGGED_EVENT = "EMOTION_LOGGED_EVENT";

export const EmotionLoggedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EMOTION_LOGGED_EVENT),
  payload: v.object({
    entryId: VO.EntryId,
    label: VO.EmotionLabelSchema,
    intensity: VO.EmotionIntensitySchema,
    userId: Auth.VO.UserId,
  }),
});

export type EmotionLoggedEventType = v.InferOutput<typeof EmotionLoggedEvent>;
