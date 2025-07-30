import * as VO from "+emotions/value-objects";
import * as tools from "@bgord/tools";

export class WeeklyReviewExportNotificationComposer {
  compose(week: tools.Week): VO.NotificationTemplate {
    return new VO.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached");
  }
}
