import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

class AlarmRepositoryInternal implements Emotions.Ports.AlarmRepositoryPort {
  async load(id: Emotions.VO.AlarmIdType) {
    const history = await EventStore.find(
      Emotions.Aggregates.Alarm.events,
      Emotions.Aggregates.Alarm.getStream(id),
    );
    return Emotions.Aggregates.Alarm.build(id, history);
  }

  async save(aggregate: Emotions.Aggregates.Alarm) {
    await EventStore.save(aggregate.pullEvents());
  }
}

export const AlarmRepository = new AlarmRepositoryInternal();
