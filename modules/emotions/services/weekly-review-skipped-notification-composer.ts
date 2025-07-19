import * as Services from "+emotions/services/notification-template";
import type * as VO from "+emotions/value-objects";

export class WeeklyReviewSkippedNotificationComposer {
  compose(weekStartedAt: VO.WeekStart): Services.NotificationTemplate {
    return new Services.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${weekStartedAt.get()}`,
    );
  }
}
