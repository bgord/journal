import { EmotionJournalEntry } from "../../aggregates/emotion-journal-entry";
import { Pattern, PatternDetectionResult } from "./pattern";

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
