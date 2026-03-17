import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

const LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT = "LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT";

export const LowCopingEffectivenessPatternDetectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId, name: VO.PatternName }),
});

export type LowCopingEffectivenessPatternDetectedEventType = v.InferOutput<
  typeof LowCopingEffectivenessPatternDetectedEvent
>;
