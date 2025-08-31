import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

class WeeklyReviewRepositoryInternal implements Emotions.Ports.WeeklyReviewRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.WeeklyReviewIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.WeeklyReview.events,
      Emotions.Aggregates.WeeklyReview.getStream(id),
    );
    return Emotions.Aggregates.WeeklyReview.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.WeeklyReview) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const WeeklyReviewRepository = new WeeklyReviewRepositoryInternal({ IdProvider, Clock });
