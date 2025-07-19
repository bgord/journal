import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

export class WeeklyReviewNotificationComposer {
  compose(
    weekStartedAt: VO.WeekStart,
    _entries: Schema.SelectEntries[],
    _insights: VO.Advice,
  ): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      `Weekly Review - ${weekStartedAt.get()}`,
      `Weekly review: ${weekStartedAt.get()}`,
    );
  }
}
