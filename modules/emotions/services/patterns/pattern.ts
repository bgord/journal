import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";

import { MoreNegativeThanPositiveEmotionsPatternDetectedEventType } from "./more-negative-than-positive-emotions-pattern";
import { MultipleMaladaptiveReactionsPatternDetectedEventType } from "./multiple-maladaptive-reactions-pattern";
import { PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType } from "./positive-emotion-with-maladaptive-reaction-pattern";

type PatternName = string;

export type PatternDateRange = [string, string];

export type PatternDetectionResult =
  | MoreNegativeThanPositiveEmotionsPatternDetectedEventType
  | MultipleMaladaptiveReactionsPatternDetectedEventType
  | PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export abstract class Pattern {
  abstract name: PatternName;

  abstract dateRange: PatternDateRange;

  abstract check(entries: EmotionJournalEntry[]): PatternDetectionResult | null;

  getStream(): string {
    return `weekly_pattern_detection_${this.dateRange[0]}_${this.dateRange[1]}`;
  }
}
