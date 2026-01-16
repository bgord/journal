import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as z from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT =
  "MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT";

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT),
  payload: z.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId, name: VO.PatternName }),
});

export type MoreNegativeThanPositiveEmotionsPatternDetectedEventType = z.infer<
  typeof MoreNegativeThanPositiveEmotionsPatternDetectedEvent
>;
