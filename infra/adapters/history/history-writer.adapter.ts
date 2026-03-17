import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

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
    const event = bg.event(
      bg.History.Events.HistoryPopulatedEvent,
      `history_${history.subject}`,
      { ...history, id: this.deps.IdProvider.generate() },
      this.deps,
    );

    await this.deps.Sleeper.wait(tools.Duration.Ms(10));
    await this.deps.EventStore.save([event]);
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = bg.event(
      bg.History.Events.HistoryClearedEvent,
      `history_${subject}`,
      { subject },
      this.deps,
    );

    await this.deps.Sleeper.wait(tools.Duration.Ms(10));
    await this.deps.EventStore.save([event]);
  }
}

export function createHistoryWriter(deps: Dependencies): bg.History.Ports.HistoryWriterPort {
  return new HistoryWriterEventStore(deps);
}
