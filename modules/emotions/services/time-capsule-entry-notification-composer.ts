import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, () => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: () => new tools.NotificationTemplate("Time capsule entry", "Go to the homepage"),
  [SupportedLanguages.pl]: () =>
    new tools.NotificationTemplate("Wpis z przeszłości", "Odwiedź stronę główną"),
};

export class TimeCapsuleEntryNotificationComposer {
  constructor(private readonly language: SupportedLanguages) {}

  compose(): tools.NotificationTemplate {
    return notification[this.language]();
  }
}
