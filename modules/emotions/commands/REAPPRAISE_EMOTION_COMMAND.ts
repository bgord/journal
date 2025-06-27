import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const REAPPRAISE_EMOTION_COMMAND = "REAPPRAISE_EMOTION_COMMAND";

export const ReappraiseEmotionCommand = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REAPPRAISE_EMOTION_COMMAND),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    newLabel: VO.EmotionLabelSchema,
    newIntensity: VO.EmotionIntensitySchema,
  }),
});

export type ReappraiseEmotionCommandType = z.infer<typeof ReappraiseEmotionCommand>;
