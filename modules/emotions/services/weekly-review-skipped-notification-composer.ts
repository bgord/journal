import * as VO from "../value-objects";

export class WeeklyReviewSkippedNotificationComposer {
  compose(weekStartedAt: VO.WeekStart) {
    return {
      subject: "Weekly Review - come back and journal",
      content: `Week you missed ${weekStartedAt.get()}`,
    };
  }
}
