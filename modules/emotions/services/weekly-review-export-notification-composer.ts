import * as tools from "@bgord/tools";
import { SupportedLanguages } from "+languages";
import type * as Queries from "+emotions/queries";

const notification: Record<SupportedLanguages, (week: tools.Week) => tools.NotificationTemplate> = {
  [SupportedLanguages.en]: (week: tools.Week) =>
    new tools.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached"),
  [SupportedLanguages.pl]: (week: tools.Week) =>
    new tools.NotificationTemplate(`Przegląd tygodnia PDF - ${week.getStart()}`, "Plik w załączniku"),
};

export class WeeklyReviewExportNotificationComposer {
  compose(
    weeklyReview: Queries.WeeklyReviewExportDto,
    language: SupportedLanguages,
  ): tools.NotificationTemplate {
    // TODO: accept only the week
    const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);
    return notification[language](week);
  }
}
