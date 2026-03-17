import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";

type AcceptedEvent = bg.History.Events.HistoryPopulatedEventType | bg.History.Events.HistoryClearedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
};

class HistoryWriterEventStore implements bg.History.Ports.HistoryWriterPort {
  constructor(private readonly deps: Dependencies) {}

  async populate(history: Omit<bg.History.VO.HistoryType, "id">) {
    const event = v.parse(bg.History.Events.HistoryPopulatedEvent, {
      ...bg.createEventEnvelope(`history_${history.subject}`, this.deps),
      name: bg.History.Events.HISTORY_POPULATED_EVENT,
      payload: { ...history, id: this.deps.IdProvider.generate() },
    } satisfies bg.History.Events.HistoryPopulatedEventType);

    await this.deps.Sleeper.wait(tools.Duration.Ms(10));
    await this.deps.EventStore.save([event]);
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = v.parse(bg.History.Events.HistoryClearedEvent, {
      ...bg.createEventEnvelope(`history_${subject}`, this.deps),
      name: bg.History.Events.HISTORY_CLEARED_EVENT,
      payload: { subject },
    } satisfies bg.History.Events.HistoryClearedEventType);

    await this.deps.Sleeper.wait(tools.Duration.Ms(10));
    await this.deps.EventStore.save([event]);
  }
}

export function createHistoryWriter(deps: Dependencies): bg.History.Ports.HistoryWriterPort {
  return new HistoryWriterEventStore(deps);
}
