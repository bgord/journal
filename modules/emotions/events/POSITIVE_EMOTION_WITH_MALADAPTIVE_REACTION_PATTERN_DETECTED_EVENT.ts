import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT =
  "POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT";

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});

/** @public */
export type PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType = z.infer<
  typeof PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
>;
