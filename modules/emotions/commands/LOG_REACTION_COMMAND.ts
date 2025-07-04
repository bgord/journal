import * as Entities from "+emotions/entities";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const LOG_REACTION_COMMAND = "LOG_REACTION_COMMAND";

export const LogReactionCommand = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_REACTION_COMMAND),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    reaction: z.instanceof(Entities.Reaction),
  }),
});

export type LogReactionCommandType = z.infer<typeof LogReactionCommand>;
