import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EMOTION_LOGGED_EVENT = "EMOTION_LOGGED_EVENT";

export const EmotionLoggedEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(EMOTION_LOGGED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    label: VO.EmotionLabelSchema,
    intensity: VO.EmotionIntensitySchema,
    userId: Auth.VO.UserId,
  }),
});

export type EmotionLoggedEventType = z.infer<typeof EmotionLoggedEvent>;
