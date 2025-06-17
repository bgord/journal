import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDateRange, PatternDetectionResult } from "./pattern";

export const MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT =
  "MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT";

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = z.object({
  id: bg.UUID,
  createdAt: tools.Timestamp,
  stream: z.string().min(1),
  name: z.literal(MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT),
  version: z.literal(1),
  payload: z.object({}),
});

export type MoreNegativeThanPositiveEmotionsPatternDetectedEventType = z.infer<
  typeof MoreNegativeThanPositiveEmotionsPatternDetectedEvent
>;

export class MoreNegativeThanPositiveEmotionsPattern extends Pattern {
  name = "MoreNegativeThanPositiveEmotionsPattern";

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: EmotionJournalEntry[]): PatternDetectionResult | null {
    const summaries = entries.map((entry) => entry.summarize());

    const positiveEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isPositive()).length;

    const negativeEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isNegative()).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }
    return null;
  }
}
