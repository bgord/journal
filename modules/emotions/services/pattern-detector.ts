import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

type PatternName = string;

type DetectedResult = { detected: true; name: PatternName };

type UndetectedResult = { detected: false; name: PatternName };

abstract class Pattern {
  abstract name: PatternName;

  abstract check(entries: EmotionJournalEntry[]): DetectedResult | UndetectedResult;
}

export class MultipleMaladaptiveReactionsInWeekPattern extends Pattern {
  name = "MultipleMaladaptiveReactionsInWeekPattern";

  check(entries: EmotionJournalEntry[]): DetectedResult | UndetectedResult {
    const detected =
      entries.map((entry) => entry.summarize()).filter((entry) => entry.reaction?.type.isMaladaptive())
        .length >= 3;

    return { detected, name: this.name };
  }
}

export class PatternDetector {
  static detect(entries: EmotionJournalEntry[], patterns: Pattern[]): DetectedResult[] {
    return patterns.map((rule) => rule.check(entries)).filter((result) => result.detected);
  }
}
