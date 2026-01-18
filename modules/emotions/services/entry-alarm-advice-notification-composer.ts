import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  SupportedLanguages,
  (entry: VO.EntrySnapshot, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  [SupportedLanguages.en]: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: "JOURNAL - emotional advice",
    html: `Advice for emotion entry: ${entry.emotionLabel}: ${advice.get()}`,
  }),
  [SupportedLanguages.pl]: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: "JOURNAL - porada emocjonalna",
    html: `Porada dla emocji: ${entry.emotionLabel}: ${advice.get()}`,
  }),
};

export class EntryAlarmAdviceNotificationComposer {
  constructor(
    private readonly entry: VO.EntrySnapshot,
    private readonly language: SupportedLanguages,
  ) {}

  compose(advice: AI.Advice): bg.MailerTemplateMessage {
    return notification[this.language](this.entry, advice);
  }
}
