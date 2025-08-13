import * as AI from "+ai";
import * as Emotions from "+emotions";
import type * as Schema from "+infra/schema";

export class EntryAlarmAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEntries) {}

  compose(advice: AI.Advice): Emotions.VO.NotificationTemplate {
    return new Emotions.VO.NotificationTemplate(
      "Emotional advice",
      `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`,
    );
  }
}
