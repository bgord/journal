import type { WeeklyReview } from "+emotions/aggregates";
import type * as VO from "+emotions/value-objects";

export interface WeeklyReviewRepositoryPort {
  load(id: VO.AlarmIdType): Promise<WeeklyReview>;
  save(aggregate: WeeklyReview): Promise<void>;
}
