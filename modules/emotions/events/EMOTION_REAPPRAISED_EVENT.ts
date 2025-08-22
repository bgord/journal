import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";

export const EmotionReappraisedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(EMOTION_REAPPRAISED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
    userId: Auth.VO.UserId,
  }),
});

export type EmotionReappraisedEventType = z.infer<typeof EmotionReappraisedEvent>;
