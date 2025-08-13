import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";

export const REAPPRAISE_EMOTION_COMMAND = "REAPPRAISE_EMOTION_COMMAND";

export const ReappraiseEmotionCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(REAPPRAISE_EMOTION_COMMAND),
  revision: z.instanceof(tools.Revision),
  payload: z.object({
    entryId: VO.EntryId,
    newEmotion: z.instanceof(Entities.Emotion),
    userId: Auth.VO.UserId,
  }),
});

export type ReappraiseEmotionCommandType = z.infer<typeof ReappraiseEmotionCommand>;
