import * as VO from "+emotions/value-objects";
import * as tools from "@bgord/tools";

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${week.getStart()}`,
    );
  }
}
