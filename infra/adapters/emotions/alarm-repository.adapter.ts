import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Emotions.Aggregates.AlarmEventType>;
};

class AlarmRepositoryInternal implements Emotions.Ports.AlarmRepositoryPort {
  constructor(private readonly deps: Dependencies) {}

  async load(id: Emotions.VO.AlarmIdType) {
    const registry = new bg.EventValidatorRegistryZodAdapter<Emotions.Aggregates.AlarmEventType>(
      Emotions.Aggregates.Alarm.events,
    );

    const history = await this.deps.EventStore.find(registry, Emotions.Aggregates.Alarm.getStream(id));

    return Emotions.Aggregates.Alarm.build(id, history, this.deps);
  }

  async save(aggregate: Emotions.Aggregates.Alarm) {
    await this.deps.EventStore.save(aggregate.pullEvents());
  }
}

export function createAlarmRepository(deps: Dependencies): Emotions.Ports.AlarmRepositoryPort {
  return new AlarmRepositoryInternal(deps);
}
