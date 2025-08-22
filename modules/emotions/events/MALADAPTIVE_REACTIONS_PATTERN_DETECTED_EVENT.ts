import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import { BaseEventData } from "../../../base";

export const MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT = "MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT";

export const MaladaptiveReactionsPatternDetectedEvent = z.object({
  ...BaseEventData,
  name: z.literal(MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT),
  payload: z.object({
    userId: Auth.VO.UserId,
    weekIsoId: tools.WeekIsoId,
    entryIds: z.array(VO.EntryId),
    name: VO.PatternName,
  }),
});

export type MaladaptiveReactionsPatternDetectedEventType = z.infer<
  typeof MaladaptiveReactionsPatternDetectedEvent
>;
