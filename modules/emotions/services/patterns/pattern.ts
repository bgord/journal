import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";

type PatternName = string;

export type PatternDateRange = [string, string];

export type PatternDetectionResult =
  | Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType
  | Events.MultipleMaladaptiveReactionsPatternDetectedEventType
  | Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export abstract class Pattern {
  abstract name: PatternName;

  abstract dateRange: PatternDateRange;

  abstract check(entries: Aggregates.EmotionJournalEntry[]): PatternDetectionResult | null;

  getStream(): string {
    return `weekly_pattern_detection_${this.dateRange[0]}_${this.dateRange[1]}`;
  }
}
