import type * as Schema from "../../../infra/schema";
import * as VO from "../value-objects";

export class EmotionalAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEmotionJournalEntries) {}

  compose(advice: VO.EmotionalAdviceType) {
    return `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice}`;
  }
}
