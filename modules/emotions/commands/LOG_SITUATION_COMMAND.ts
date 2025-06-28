import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Entities from "../entities";
import * as VO from "../value-objects";

export const LOG_SITUATION_COMMAND = "LOG_SITUATION_COMMAND";

export const LogSituationCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_SITUATION_COMMAND),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    situation: z.instanceof(Entities.Situation),
  }),
});

export type LogSituationCommandType = z.infer<typeof LogSituationCommand>;
