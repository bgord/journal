import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const LOG_REACTION_COMMAND = "LOG_REACTION_COMMAND";

export const LogReactionCommand = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(LOG_REACTION_COMMAND),
  payload: z.object({
    id: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});

export type LogReactionCommandType = z.infer<typeof LogReactionCommand>;
