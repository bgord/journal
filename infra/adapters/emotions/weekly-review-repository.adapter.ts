import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { EventStoreType } from "+infra/tools/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort; EventStore: EventStoreType };

class WeeklyReviewRepositoryInternal implements Emotions.Ports.WeeklyReviewRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.WeeklyReviewIdType) {
    const registry = new bg.EventValidatorRegistryZodAdapter<Emotions.Aggregates.WeeklyReviewEventType>(
      Emotions.Aggregates.WeeklyReview.events,
    );

    const history = await this.deps.EventStore.find(registry, Emotions.Aggregates.WeeklyReview.getStream(id));

    return Emotions.Aggregates.WeeklyReview.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.WeeklyReview) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createWeeklyReviewRepository(deps: Dependencies) {
  return new WeeklyReviewRepositoryInternal(deps);
}
