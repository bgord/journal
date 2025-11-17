import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      `JOURNAL - weekly review ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
      "Find the file attached",
    ),
  [SupportedLanguages.pl]: (week: tools.Week) =>
    new tools.NotificationTemplate(
      `JOURNAL - przegląd tygodnia ${tools.DateFormatters.date(week.getStart().ms)} - ${tools.DateFormatters.date(week.getEnd().ms)}`,
      "Plik w załączniku",
    ),
};

export class WeeklyReviewExportNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): tools.NotificationTemplate {
    return notification[language](week);
  }
}
