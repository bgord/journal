import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const EMOTION_REAPPRAISED_EVENT = "EMOTION_REAPPRAISED_EVENT";

export const EmotionReappraisedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_REAPPRAISED_EVENT),
  version: z.literal(1),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
  }),
});

export type EmotionReappraisedEventType = z.infer<typeof EmotionReappraisedEvent>;
