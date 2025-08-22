import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

class EntryRepositoryInternal implements Emotions.Ports.EntryRepositoryPort {
  async load(id: Emotions.VO.EntryIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Entry.events,
      Emotions.Aggregates.Entry.getStream(id),
    );
    return Emotions.Aggregates.Entry.build(id, history);
  }

  async save(aggregate: Emotions.Aggregates.Entry) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const EntryRepository = new EntryRepositoryInternal();
