import * as bg from "@bgord/bun";
import type { LanguagesType } from "+languages";

const notification: Record<LanguagesType, () => bg.MailerTemplateMessage> = {
  en: () => ({
    subject: bg.MailerSubject.parse("JOURNAL - time capsule entry"),
    html: bg.MailerContentHtml.parse("Go to the homepage"),
  }),
  pl: () => ({
    subject: bg.MailerSubject.parse("JOURNAL - wpis z przeszłości"),
    html: bg.MailerContentHtml.parse("Odwiedź stronę główną"),
  }),
};

export class TimeCapsuleEntryNotificationComposer {
  constructor(private readonly language: LanguagesType) {}

  compose(): bg.MailerTemplateMessage {
    return notification[this.language]();
  }
}
