import * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, () => bg.MailerTemplateMessage> = {
  [SupportedLanguages.en]: () => ({
    subject: bg.MailerSubject.parse("JOURNAL - time capsule entry"),
    html: bg.MailerContentHtml.parse("Go to the homepage"),
  }),
  [SupportedLanguages.pl]: () => ({
    subject: bg.MailerSubject.parse("JOURNAL - wpis z przeszłości"),
    html: bg.MailerContentHtml.parse("Odwiedź stronę główną"),
  }),
};

export class TimeCapsuleEntryNotificationComposer {
  constructor(private readonly language: SupportedLanguages) {}

  compose(): bg.MailerTemplateMessage {
    return notification[this.language]();
  }
}
