import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as AI from "+ai";
import type { LanguagesType } from "+languages";
import type * as VO from "+emotions/value-objects";

const notification: Record<
  LanguagesType,
  (entry: VO.EntrySnapshot, advice: AI.Advice) => bg.MailerTemplateMessage
> = {
  en: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - emotional advice"),
    html: v.parse(bg.MailerContentHtml, `Advice for emotion entry: ${entry.emotionLabel}: ${advice.get()}`),
  }),
  pl: (entry: VO.EntrySnapshot, advice: AI.Advice) => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - porada emocjonalna"),
    html: v.parse(bg.MailerContentHtml, `Porada dla emocji: ${entry.emotionLabel}: ${advice.get()}`),
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
