import type * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, () => bg.MailerTemplateMessage> = {
  [SupportedLanguages.en]: () => ({ subject: "JOURNAL - time capsule entry", html: "Go to the homepage" }),
  [SupportedLanguages.pl]: () => ({ subject: "JOURNAL - wpis z przeszłości", html: "Odwiedź stronę główną" }),
};

export class TimeCapsuleEntryNotificationComposer {
  constructor(private readonly language: SupportedLanguages) {}

  compose(): bg.MailerTemplateMessage {
    return notification[this.language]();
  }
}
