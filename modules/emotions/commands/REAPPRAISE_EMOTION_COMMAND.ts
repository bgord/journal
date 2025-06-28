import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Entities from "../entities";
import * as VO from "../value-objects";

export const REAPPRAISE_EMOTION_COMMAND = "REAPPRAISE_EMOTION_COMMAND";

export const ReappraiseEmotionCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REAPPRAISE_EMOTION_COMMAND),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    newEmotion: z.instanceof(Entities.Emotion),
  }),
});

export type ReappraiseEmotionCommandType = z.infer<typeof ReappraiseEmotionCommand>;
