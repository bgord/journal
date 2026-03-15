import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Emotions.Aggregates.EntryEventType>;
};

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.EntryIdType) {
    const registry = new bg.EventValidatorRegistryZodAdapter<Emotions.Aggregates.EntryEventType>(
      Emotions.Aggregates.Entry.events,
    );

    const history = await this.deps.EventStore.find(registry, Emotions.Aggregates.Entry.getStream(id));

    return Emotions.Aggregates.Entry.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Entry) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createEntryRepository(deps: Dependencies): Emotions.Ports.EntryRepositoryPort {
  return new EntryRepositoryInternal(deps);
}
