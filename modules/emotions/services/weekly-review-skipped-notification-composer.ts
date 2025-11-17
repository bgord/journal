import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      `JOURNAL - weekly review ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
      "Come back and journal",
    ),
  [SupportedLanguages.pl]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      `JOURNAL - przegląd tygodnia ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
      "Wróć do nas",
    ),
};

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): tools.NotificationTemplate {
    return notification[language](week);
  }
}
