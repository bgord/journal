import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";

type PatternName = string;

export type PatternDetectedResult = { detected: true; name: PatternName };

type PatternUndetectedResult = { detected: false; name: PatternName };

export type PatternDetectionResult = PatternDetectedResult | PatternUndetectedResult;

export abstract class Pattern {
  abstract name: PatternName;

  abstract check(entries: EmotionJournalEntry[]): PatternDetectionResult;
}
