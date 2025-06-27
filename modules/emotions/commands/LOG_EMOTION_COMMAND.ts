import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Entities from "../entities";
import * as VO from "../value-objects";

export const LOG_EMOTION_COMMAND = "LOG_EMOTION_COMMAND";

export const LogEmotionCommand = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_EMOTION_COMMAND),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    emotion: z.instanceof(Entities.Emotion),
  }),
});

export type LogEmotionCommandType = z.infer<typeof LogEmotionCommand>;
