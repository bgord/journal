import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const EMOTION_LOGGED_EVENT = "EMOTION_LOGGED_EVENT";

export const EmotionLoggedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(EMOTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    label: VO.EmotionLabelSchema,
    intensity: VO.EmotionIntensitySchema,
  }),
});

export type EmotionLoggedEventType = z.infer<typeof EmotionLoggedEvent>;
