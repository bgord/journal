import * as tools from "@bgord/tools";

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week): tools.NotificationTemplate {
    return new tools.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${week.getStart()}`,
    );
  }
}
