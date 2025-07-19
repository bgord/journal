import type * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

// TODO: everything with emotional advice tbc
export class EmotionalAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEntries) {}

  compose(advice: VO.Advice) {
    return {
      subject: "Emotional advice",
      content: `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`,
    };
  }
}
