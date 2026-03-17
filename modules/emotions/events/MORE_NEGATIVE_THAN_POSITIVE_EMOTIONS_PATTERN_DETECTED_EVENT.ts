import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT =
  "MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT";

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId, name: VO.PatternName }),
});

export type MoreNegativeThanPositiveEmotionsPatternDetectedEventType = v.InferOutput<
  typeof MoreNegativeThanPositiveEmotionsPatternDetectedEvent
>;
