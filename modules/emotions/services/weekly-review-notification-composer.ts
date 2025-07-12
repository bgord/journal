import * as VO from "+emotions/value-objects";
import * as Schema from "+infra/schema";

export class WeeklyReviewNotificationComposer {
  compose(weekStartedAt: VO.WeekStart, _entries: Schema.SelectEntries[], _insights: VO.EmotionalAdvice) {
    return `Weekly review: ${weekStartedAt.get()}`;
  }
}
