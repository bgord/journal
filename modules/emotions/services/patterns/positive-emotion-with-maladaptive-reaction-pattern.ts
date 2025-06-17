import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDetectionResult } from "./pattern";

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
