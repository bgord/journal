import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

class WeeklyReviewRepositoryInternal implements Emotions.Ports.WeeklyReviewRepositoryPort {
  constructor(private readonly IdProvider: bg.IdProviderPort) {}

  async load(id: Emotions.VO.WeeklyReviewIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.WeeklyReview.events,
      Emotions.Aggregates.WeeklyReview.getStream(id),
    );
    return Emotions.Aggregates.WeeklyReview.build(id, history, { IdProvider: this.IdProvider });
  }

  async save(aggregate: Emotions.Aggregates.WeeklyReview) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const WeeklyReviewRepository = new WeeklyReviewRepositoryInternal(IdProvider);
