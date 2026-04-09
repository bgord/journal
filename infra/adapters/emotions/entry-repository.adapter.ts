import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Emotions.Aggregates.EntryEventType>;
};

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.EntryIdType): Promise<Emotions.Aggregates.Entry> {
    const history = await this.deps.EventStore.find(
      Emotions.Aggregates.Entry.registry,
      Emotions.Aggregates.Entry.getStream(id),
    );

    return Emotions.Aggregates.Entry.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Entry): Promise<void> {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createEntryRepository(deps: Dependencies): Emotions.Ports.EntryRepositoryPort {
  return new EntryRepositoryInternal(deps);
}
