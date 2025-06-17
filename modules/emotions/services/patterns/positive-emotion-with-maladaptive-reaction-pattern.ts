import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDateRange, PatternDetectionResult } from "./pattern";

export const POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT =
  "POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT";

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});

export type PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType = z.infer<
  typeof PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent
>;

export class PositiveEmotionWithMaladaptiveReactionPattern extends Pattern {
  name = "PositiveEmotionWithMaladaptiveReactionPattern";

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: EmotionJournalEntry[]): PatternDetectionResult | null {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.emotion?.label.isPositive())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    if (matches.length >= 3) {
      return PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }

    return null;
  }
}
