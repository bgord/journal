import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT =
  "POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT";

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT),
  payload: v.object({
    userId: Auth.VO.UserId,
    weekIsoId: tools.WeekIsoId,
    entryIds: v.array(VO.EntryId),
    name: VO.PatternName,
  }),
});

export type PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType = v.InferOutput<
  typeof PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
>;
