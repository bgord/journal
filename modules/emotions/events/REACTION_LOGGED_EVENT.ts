import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const REACTION_LOGGED_EVENT = "REACTION_LOGGED_EVENT";

export const ReactionLoggedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_LOGGED_EVENT),
  version: z.literal(1),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});

export type ReactionLoggedEventType = z.infer<typeof ReactionLoggedEvent>;
