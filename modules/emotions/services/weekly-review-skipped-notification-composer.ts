import * as tools from "@bgord/tools";
import * as VO from "+emotions/value-objects";

export class WeeklyReviewSkippedNotificationComposer {
  compose(week: tools.Week): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${week.getStart()}`,
    );
  }
}
