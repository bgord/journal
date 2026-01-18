import * as bg from "@bgord/bun";
import type * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  SupportedLanguages,
  (entry: VO.EntrySnapshot, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  [SupportedLanguages.en]: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - emotional advice"),
    html: bg.MailerContentHtml.parse(`Advice for emotion entry: ${entry.emotionLabel}: ${advice.get()}`),
  }),
  [SupportedLanguages.pl]: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - porada emocjonalna"),
    html: bg.MailerContentHtml.parse(`Porada dla emocji: ${entry.emotionLabel}: ${advice.get()}`),
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
