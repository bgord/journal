import { z } from "zod/v4";
import * as Aggregates from "../../aggregates/emotion-journal-entry";
import * as Events from "../../events";

type PatternName = string;

export type PatternDateRange = [string, string];

export type PatternDetectionEvent =
  | typeof Events.MoreNegativeThanPositiveEmotionsPatternDetectedEvent
  | typeof Events.MultipleMaladaptiveReactionsPatternDetectedEvent
  | typeof Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent;

export type PatternDetectionEventType = z.infer<PatternDetectionEvent>;

export abstract class Pattern {
  abstract name: PatternName;

  abstract dateRange: PatternDateRange;

  abstract check(entries: Aggregates.EmotionJournalEntry[]): PatternDetectionEventType | null;

  getStream(): string {
    return `weekly_pattern_detection_${this.dateRange[0]}_${this.dateRange[1]}`;
  }
}
