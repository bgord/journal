import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const LOG_EMOTION_COMMAND = "LOG_EMOTION_COMMAND";

export const LogEmotionCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_EMOTION_COMMAND),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    emotion: z.instanceof(Entities.Emotion),
  }),
});

export type LogEmotionCommandType = z.infer<typeof LogEmotionCommand>;
