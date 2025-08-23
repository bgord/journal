import * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+languages";

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week, _language: SupportedLanguages): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${week.getStart()}`,
    );
  }
}
