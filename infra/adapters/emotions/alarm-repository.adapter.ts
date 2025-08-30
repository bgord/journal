import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { EventStore } from "+infra/event-store";

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

class AlarmRepositoryInternal implements Emotions.Ports.AlarmRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.AlarmIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Alarm.events,
      Emotions.Aggregates.Alarm.getStream(id),
    );
    return Emotions.Aggregates.Alarm.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Alarm) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const AlarmRepository = new AlarmRepositoryInternal({ IdProvider, Clock });
