import type * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

export class WeeklyReviewNotificationComposer {
  compose(weekStartedAt: VO.WeekStart, _entries: Schema.SelectEntries[], _insights: VO.Advice) {
    return {
      subject: `Weekly Review - ${weekStartedAt.get()}`,
      content: `Weekly review: ${weekStartedAt.get()}`,
    };
  }
}
