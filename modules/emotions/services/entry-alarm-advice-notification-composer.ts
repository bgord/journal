import * as tools from "@bgord/tools";
import * as AI from "+ai";
import type * as Schema from "+infra/schema";

export class EntryAlarmAdviceNotificationComposer {
  constructor(private readonly entry: Schema.SelectEntries) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Emotional advice",
      `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`,
    );
  }
}
