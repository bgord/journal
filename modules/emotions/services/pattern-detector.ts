import * as tools from "@bgord/tools";
import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

import { Pattern, PatternDateRange, PatternDetectionResult } from "./patterns/pattern";

type PatternDetectorConfigType = {
  entries: EmotionJournalEntry[];
  patterns: tools.Constructor<Pattern>[];
  dateRange: PatternDateRange;
};

export class PatternDetector {
  static detect(config: PatternDetectorConfigType): PatternDetectionResult[] {
    return config.patterns
      .map((Pattern) => new Pattern(config.dateRange).check(config.entries))
      .filter((result) => result !== null);
  }
}
