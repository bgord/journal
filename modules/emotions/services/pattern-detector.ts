import * as tools from "@bgord/tools";
import type * as Aggregates from "../aggregates/emotion-journal-entry";

import * as Patterns from "./patterns/pattern";

type PatternDetectorConfigType = {
  entries: Aggregates.EmotionJournalEntry[];
  patterns: tools.Constructor<Patterns.Pattern>[];
  dateRange: Patterns.PatternDateRange;
};

/** @public */
export class PatternDetector {
  static detect(config: PatternDetectorConfigType): Patterns.PatternDetectionEventType[] {
    return config.patterns
      .map((Pattern) => new Pattern(config.dateRange).check(config.entries))
      .filter((result) => result !== null);
  }
}
