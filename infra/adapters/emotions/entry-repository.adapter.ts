import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.EntryIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(id),
    );
    return Emotions.Aggregates.Entry.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Entry) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const EntryRepository = new EntryRepositoryInternal({ IdProvider, Clock });
