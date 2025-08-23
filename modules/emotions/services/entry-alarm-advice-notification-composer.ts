import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

export class EntryAlarmAdviceNotificationComposer {
  constructor(
    private readonly entry: VO.EntrySnapshot,
    _language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Emotional advice",
      `Advice for emotion entry: ${this.entry.emotionLabel}: ${advice.get()}`,
    );
  }
}
