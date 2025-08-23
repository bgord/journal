import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  SupportedLanguages,
  (entry: VO.EntrySnapshot, advice: AI.Advice) => tools.NotificationTemplate
> = {
  [SupportedLanguages.en]: (entry: VO.EntrySnapshot, advice: AI.Advice) =>
    new tools.NotificationTemplate(
      "Emotional advice",
      `Advice for emotion entry: ${entry.emotionLabel}: ${advice.get()}`,
    ),
  [SupportedLanguages.pl]: (entry: VO.EntrySnapshot, advice: AI.Advice) =>
    new tools.NotificationTemplate(
      "Porada emocjonalna",
      `Porada dla emocji: ${entry.emotionLabel}: ${advice.get()}`,
    ),
};

export class EntryAlarmAdviceNotificationComposer {
  constructor(
    private readonly entry: VO.EntrySnapshot,
    private readonly language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): tools.NotificationTemplate {
    return notification[this.language](this.entry, advice);
  }
}
