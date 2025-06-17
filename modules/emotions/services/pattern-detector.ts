import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

import { Pattern, PatternDetectedResult } from "./patterns/pattern";

export class PatternDetector {
  static detect(entries: EmotionJournalEntry[], patterns: Pattern[]): PatternDetectedResult[] {
    return patterns.map((rule) => rule.check(entries)).filter((result) => result.detected);
  }
}
