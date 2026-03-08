import * as bg from "@bgord/bun";
import type * as AI from "+ai";
import type { LanguagesType } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  LanguagesType,
  (entry: VO.EntrySnapshot, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  en: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - emotional advice"),
    html: bg.MailerContentHtml.parse(`Advice for emotion entry: ${entry.emotionLabel}: ${advice.get()}`),
  }),
  pl: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: bg.MailerSubject.parse("JOURNAL - porada emocjonalna"),
    html: bg.MailerContentHtml.parse(`Porada dla emocji: ${entry.emotionLabel}: ${advice.get()}`),
  }),
};

export class EntryAlarmAdviceNotificationComposer {
  constructor(
    private readonly entry: VO.EntrySnapshot,
    private readonly language: LanguagesType,
  ) {}

  compose(advice: AI.Advice): bg.MailerTemplateMessage {
    return notification[this.language](this.entry, advice);
  }
}
