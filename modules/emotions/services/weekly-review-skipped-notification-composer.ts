import * as VO from "+emotions/value-objects";

export class WeeklyReviewSkippedNotificationComposer {
  compose(weekStartedAt: VO.WeekStart): VO.NotificationTemplate {
    return new VO.NotificationTemplate(
      "Weekly Review - come back and journal",
      `Week you missed ${weekStartedAt.get()}`,
    );
  }
}
