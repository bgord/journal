import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: ReturnType<typeof createEventStore>;
};

class WeeklyReviewRepositoryInternal implements Emotions.Ports.WeeklyReviewRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.WeeklyReviewIdType) {
    const history = await this.deps.EventStore.find(
      Emotions.Aggregates.WeeklyReview.events,
      Emotions.Aggregates.WeeklyReview.getStream(id),
    );
    return Emotions.Aggregates.WeeklyReview.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.WeeklyReview) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createWeeklyReviewRepository(deps: Dependencies) {
  return new WeeklyReviewRepositoryInternal(deps);
}
