import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { LanguagesType } from "+languages";

const notification: Record<LanguagesType, () => bg.MailerTemplateMessage> = {
  en: () => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - time capsule entry"),
    html: v.parse(bg.MailerContentHtml, "Go to the homepage"),
  }),
  pl: () => ({
    subject: v.parse(bg.MailerSubject, "JOURNAL - wpis z przeszłości"),
    html: v.parse(bg.MailerContentHtml, "Odwiedź stronę główną"),
  }),
};

export class TimeCapsuleEntryNotificationComposer {
  constructor(private readonly language: LanguagesType) {}

  compose(): bg.MailerTemplateMessage {
    return notification[this.language]();
  }
}
