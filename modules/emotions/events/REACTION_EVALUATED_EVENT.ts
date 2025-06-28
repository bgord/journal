import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as VO from "../value-objects";

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";

export const ReactionEvaluatedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(REACTION_EVALUATED_EVENT),
  version: z.literal(1),
  payload: z.object({
    emotionJournalEntryId: VO.EmotionJournalEntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
  }),
});

export type ReactionEvaluatedEventType = z.infer<typeof ReactionEvaluatedEvent>;
