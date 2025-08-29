import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

class AlarmRepositoryInternal implements Emotions.Ports.AlarmRepositoryPort {
  constructor(private readonly IdProvider: bg.IdProviderPort) {}

  async load(id: Emotions.VO.AlarmIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Alarm.events,
      Emotions.Aggregates.Alarm.getStream(id),
    );
    return Emotions.Aggregates.Alarm.build(id, history, { IdProvider: this.IdProvider });
  }

  async save(aggregate: Emotions.Aggregates.Alarm) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const AlarmRepository = new AlarmRepositoryInternal(IdProvider);
