import * as tools from "@bgord/tools";
import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

import { Pattern, PatternDateRange, PatternDetectionEventType } from "./patterns/pattern";

type PatternDetectorConfigType = {
  entries: EmotionJournalEntry[];
  patterns: tools.Constructor<Pattern>[];
  dateRange: PatternDateRange;
};

/** @public */
export class PatternDetector {
  static detect(config: PatternDetectorConfigType): PatternDetectionEventType[] {
    return config.patterns
      .map((Pattern) => new Pattern(config.dateRange).check(config.entries))
      .filter((result) => result !== null);
  }
}
