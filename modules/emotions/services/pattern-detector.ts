import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

import { Pattern, PatternDetectionResult } from "./patterns/pattern";

export class PatternDetector {
  static detect(entries: EmotionJournalEntry[], patterns: Pattern[]): PatternDetectionResult[] {
    return patterns.map((rule) => rule.check(entries)).filter((result) => result !== null);
  }
}
