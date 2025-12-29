import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { EventStoreType } from "+infra/tools/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort; EventStore: EventStoreType };

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.EntryIdType) {
    const history = await this.deps.EventStore.find(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(id),
    );
    return Emotions.Aggregates.Entry.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Entry) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createEntryRepository(deps: Dependencies): Emotions.Ports.EntryRepositoryPort {
  return new EntryRepositoryInternal(deps);
}
