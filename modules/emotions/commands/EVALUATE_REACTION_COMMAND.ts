import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Entities from "../entities";
import * as VO from "../value-objects";

export const EVALUATE_REACTION_COMMAND = "EVALUATE_REACTION_COMMAND";

export const EvaluateReactionCommand = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  name: z.literal(EVALUATE_REACTION_COMMAND),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    newReaction: z.instanceof(Entities.Reaction),
  }),
});

export type EvaluateReactionCommandType = z.infer<typeof EvaluateReactionCommand>;
