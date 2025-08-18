import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

class WeeklyReviewRepositoryBg implements Emotions.Ports.WeeklyReviewRepositoryPort {
  async load(id: Emotions.VO.WeeklyReviewIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.WeeklyReview.events,
      Emotions.Aggregates.WeeklyReview.getStream(id),
    );
    return Emotions.Aggregates.WeeklyReview.build(id, history);
  }

  async save(aggregate: Emotions.Aggregates.WeeklyReview) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const WeeklyReviewRepository = new WeeklyReviewRepositoryBg();
