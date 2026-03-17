import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export const MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT = "MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT";

export const MaladaptiveReactionsPatternDetectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT),
  payload: v.object({
    userId: Auth.VO.UserId,
    weekIsoId: tools.WeekIsoId,
    entryIds: v.array(VO.EntryId),
    name: VO.PatternName,
  }),
});

export type MaladaptiveReactionsPatternDetectedEventType = v.InferOutput<
  typeof MaladaptiveReactionsPatternDetectedEvent
>;
