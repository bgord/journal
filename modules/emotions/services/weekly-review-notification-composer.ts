import * as VO from "../value-objects";
import * as Schema from "../../../infra/schema";

export class WeeklyReviewNotificationComposer {
  constructor() {}

  compose(
    weekStartedAt: VO.WeekStart,
    _entries: Schema.SelectEmotionJournalEntries[],
    _insights: VO.EmotionalAdvice,
  ) {
    return `Weekly review: ${weekStartedAt.get()}`;
  }
}
