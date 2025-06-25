import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class EmotionalAdviceNotificationComposer {
  constructor(private readonly entrySummary: Aggregates.EmotionJournalEntrySummary) {}

  compose(advice: VO.EmotionalAdvice) {
    return `Advice for emotion entry: ${this.entrySummary.emotion?.label}: ${advice.get()}`;
  }
}
