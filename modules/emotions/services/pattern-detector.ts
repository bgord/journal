import { EmotionJournalEntry } from "../aggregates/emotion-journal-entry";

type PatternName = string;

type PatternDetectedResult = { detected: true; name: PatternName };

type PatternUndetectedResult = { detected: false; name: PatternName };

type PatternDetectionResult = PatternDetectedResult | PatternUndetectedResult;

abstract class Pattern {
  abstract name: PatternName;

  abstract check(entries: EmotionJournalEntry[]): PatternDetectionResult;
}

export class MultipleMaladaptiveReactionsInWeekPattern extends Pattern {
  name = "MultipleMaladaptiveReactionsInWeekPattern";

  check(entries: EmotionJournalEntry[]): PatternDetectionResult {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    return { detected: matches.length >= 3, name: this.name };
  }
}

export class PositiveEmotionWithMaladaptiveReactionPattern extends Pattern {
  name = "PositiveEmotionWithMaladaptiveReactionPattern";

  check(entries: EmotionJournalEntry[]): PatternDetectionResult {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.emotion?.label.isPositive())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    return { detected: matches.length >= 3, name: this.name };
  }
}

export class MoreNegativeThanPositiveEmotionsPattern extends Pattern {
  name = "MoreNegativeThanPositiveEmotionsPattern";

  check(entries: EmotionJournalEntry[]): PatternDetectionResult {
    const summaries = entries.map((entry) => entry.summarize());

    const positiveEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isPositive()).length;
    const negativeEmotionsCounter = summaries.filter((entry) => entry.emotion?.label.isNegative()).length;

    return {
      detected: negativeEmotionsCounter > positiveEmotionsCounter,
      name: this.name,
    };
  }
}

export class PatternDetector {
  static detect(entries: EmotionJournalEntry[], patterns: Pattern[]): PatternDetectedResult[] {
    return patterns.map((rule) => rule.check(entries)).filter((result) => result.detected);
  }
}
