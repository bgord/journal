import * as Schema from "../../../infra/schema";
import * as VO from "../value-objects";

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
