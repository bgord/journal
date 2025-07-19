import * as Services from "+emotions/services/notification-template";
import type * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

export class WeeklyReviewNotificationComposer {
  compose(
    weekStartedAt: VO.WeekStart,
    _entries: Schema.SelectEntries[],
    _insights: VO.Advice,
  ): Services.NotificationTemplate {
    return new Services.NotificationTemplate(
      `Weekly Review - ${weekStartedAt.get()}`,
      `Weekly review: ${weekStartedAt.get()}`,
    );
  }
}
