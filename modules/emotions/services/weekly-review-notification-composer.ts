import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";

export class WeeklyReviewNotificationComposer {
  compose(
    week: tools.Week,
    _entries: Schema.SelectEntries[],
    _insights: VO.Advice,
    _patterns: Schema.SelectPatternDetections[],
    _alarms: Schema.SelectAlarms[],
  ): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      `Weekly Review - ${week.getStart()}`,
      `Weekly review: ${week.getStart()}`,
    );
  }
}
