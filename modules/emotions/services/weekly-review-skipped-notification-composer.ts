import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${week.getStart()}`,
    ),
  [SupportedLanguages.pl]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      "Przegląd tygodnia - wróć do nas",
      `Przegapiony tydzień ${week.getStart()}`,
    ),
};

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): tools.NotificationTemplate {
    return notification[language](week);
  }
}
