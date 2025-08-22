import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT =
  "LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT";

export const LowCopingEffectivenessPatternDetectedEvent = z.object({
  ...BaseEventData,
  name: z.literal(LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT),
  payload: z.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId, name: VO.PatternName }),
});

export type LowCopingEffectivenessPatternDetectedEventType = z.infer<
  typeof LowCopingEffectivenessPatternDetectedEvent
>;
