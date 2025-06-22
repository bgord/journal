import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";
import { Pattern, PatternDateRange, PatternDetectionEventType, PatternKindOptions } from "./pattern";

/** @public */
export class MoreNegativeThanPositiveEmotionsPattern extends Pattern {
  name = "MoreNegativeThanPositiveEmotionsPattern";

  kind = PatternKindOptions.negative;

  constructor(public dateRange: PatternDateRange) {
    super();
  }

  check(entries: Aggregates.EmotionJournalEntry[]): PatternDetectionEventType | null {
    const summaries = entries.map((entry) => entry.summarize());

    const positiveEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isPositive()).length;

    const negativeEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isNegative()).length;

    if (negativeEmotionsCounter > positiveEmotionsCounter) {
      return Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent.parse({
        id: bg.NewUUID.generate(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
        stream: this.getStream(),
        version: 1,
        payload: {},
      });
    }
    return null;
  }
}
