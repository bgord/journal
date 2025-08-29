import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  constructor(private readonly IdProvider: bg.IdProviderPort) {}

  async load(id: Emotions.VO.EntryIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(id),
    );
    return Emotions.Aggregates.Entry.build(id, history, { IdProvider: this.IdProvider });
  }

  async save(aggregate: Emotions.Aggregates.Entry) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const EntryRepository = new EntryRepositoryInternal(IdProvider);
