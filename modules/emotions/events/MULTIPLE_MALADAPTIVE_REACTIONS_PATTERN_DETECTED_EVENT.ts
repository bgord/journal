import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT =
  "MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT";

export const MultipleMaladaptiveReactionsPatternDetectedEvent = z.object({
  id: bg.UUID,
  correlationId: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  revision: tools.RevisionValue.optional(),
  payload: z.object({
    userId: Auth.VO.UserId,
    weekIsoId: tools.WeekIsoId,
    entryIds: z.array(VO.EntryId),
    name: VO.PatternName,
  }),
});

export type MultipleMaladaptiveReactionsPatternDetectedEventType = z.infer<
  typeof MultipleMaladaptiveReactionsPatternDetectedEvent
>;
