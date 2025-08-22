import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const REACTION_EVALUATED_EVENT = "REACTION_EVALUATED_EVENT";

export const ReactionEvaluatedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  name: z.literal(REACTION_EVALUATED_EVENT),
  payload: z.object({
    entryId: VO.EntryId,
    type: VO.ReactionTypeSchema,
    effectiveness: VO.ReactionEffectivenessSchema,
    description: VO.ReactionDescriptionSchema,
    userId: Auth.VO.UserId,
  }),
});

export type ReactionEvaluatedEventType = z.infer<typeof ReactionEvaluatedEvent>;
