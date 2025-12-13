import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: ReturnType<typeof createEventStore>;
};

class AlarmRepositoryInternal implements Emotions.Ports.AlarmRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.AlarmIdType) {
    const history = await this.deps.EventStore.find(
      Emotions.Aggregates.Alarm.events,
      Emotions.Aggregates.Alarm.getStream(id),
    );
    return Emotions.Aggregates.Alarm.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Alarm) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createAlarmRepository(deps: Dependencies): Emotions.Ports.AlarmRepositoryPort {
  return new AlarmRepositoryInternal(deps);
}
