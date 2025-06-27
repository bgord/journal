import type * as Schema from "../../../infra/schema";
import * as VO from "../value-objects";

export class EmotionalAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEmotionJournalEntries) {}

  compose(advice: VO.EmotionalAdvice) {
    return `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`;
  }
}
