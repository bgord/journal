import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";

import { MoreNegativeThanPositiveEmotionsPatternDetectedEventType } from "./more-negative-than-positive-emotions-pattern";
import { MultipleMaladaptiveReactionsPatternDetectedEventType } from "./multiple-maladaptive-reactions-pattern";
import { PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType } from "./positive-emotion-with-maladaptive-reaction-pattern";

type PatternName = string;

export type PatternDetectionResult =
  | MoreNegativeThanPositiveEmotionsPatternDetectedEventType
  | MultipleMaladaptiveReactionsPatternDetectedEventType
  | PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export abstract class Pattern {
  abstract name: PatternName;

  abstract check(entries: EmotionJournalEntry[]): PatternDetectionResult | null;
}
