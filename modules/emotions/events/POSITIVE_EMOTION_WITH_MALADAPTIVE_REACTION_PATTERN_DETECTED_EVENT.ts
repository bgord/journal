import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT =
  "POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT";

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = z.object({
  ...BaseEventData,
  name: z.literal(POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT),
  payload: z.object({
    userId: Auth.VO.UserId,
    weekIsoId: tools.WeekIsoId,
    entryIds: z.array(VO.EntryId),
    name: VO.PatternName,
  }),
});

export type PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType = z.infer<
  typeof PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
>;
