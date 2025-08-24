import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";

const notification: Record<SupportedLanguages, (week: tools.Week) => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: (week: tools.Week) =>
    new tools.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached"),
  [SupportedLanguages.pl]: (week: tools.Week) =>
    new tools.NotificationTemplate(`Przegląd tygodnia PDF - ${week.getStart()}`, "Plik w załączniku"),
};

export class WeeklyReviewExportNotificationComposer {
  compose(week: tools.Week, language: SupportedLanguages): tools.NotificationTemplate {
    return notification[language](week);
  }
}
