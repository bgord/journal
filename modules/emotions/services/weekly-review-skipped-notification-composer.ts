import * as VO from "../value-objects";

export class WeeklyReviewSkippedNotificationComposer {
  constructor() {}

  compose(weekStartedAt: VO.WeekStart) {
    return `Week you missed ${weekStartedAt.get()}`;
  }
}
