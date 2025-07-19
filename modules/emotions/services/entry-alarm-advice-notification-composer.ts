import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

export class EntryAlarmAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEntries) {}

  compose(advice: VO.Advice): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      "Emotional advice",
      `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`,
    );
  }
}
