import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDetectionResult } from "./pattern";

export class MultipleMaladaptiveReactionsPattern extends Pattern {
  name = "MultipleMaladaptiveReactionsPattern";

  check(entries: EmotionJournalEntry[]): PatternDetectionResult {
    const matches = entries
      .map((entry) => entry.summarize())
      .filter((entry) => entry.reaction?.type.isMaladaptive());

    return { detected: matches.length >= 3, name: this.name };
  }
}
