import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDateRange, PatternDetectionResult } from "./pattern";

export const MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT =
  "MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT";

export const MultipleMaladaptiveReactionsPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});

export type MultipleMaladaptiveReactionsPatternDetectedEventType = z.infer<
  typeof MultipleMaladaptiveReactionsPatternDetectedEvent
>;

export class MultipleMaladaptiveReactionsPattern extends Pattern {
  name = "MultipleMaladaptiveReactionsPattern";

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: EmotionJournalEntry[]): PatternDetectionResult | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return MultipleMaladaptiveReactionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }
    return null;
  }
}
