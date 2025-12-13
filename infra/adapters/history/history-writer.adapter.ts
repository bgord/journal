import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { createEventStore } from "+infra/adapters/system/event-store";

type Dependencies = {
  EventStore: ReturnType<typeof createEventStore>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

class HistoryWriterEventStore implements bg.History.Ports.HistoryWriterPort {
  constructor(private readonly deps: Dependencies) {}

  async populate(history: Omit<bg.History.VO.HistoryType, "id">) {
    const event = bg.History.Events.HistoryPopulatedEvent.parse({
      ...bg.createEventEnvelope(`history_${history.subject}`, this.deps),
      name: bg.History.Events.HISTORY_POPULATED_EVENT,
      payload: { ...history, id: this.deps.IdProvider.generate() },
    } satisfies bg.History.Events.HistoryPopulatedEventType);

    await this.deps.EventStore.saveAfter([event], tools.Duration.Ms(10));
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = bg.History.Events.HistoryClearedEvent.parse({
      ...bg.createEventEnvelope(`history_${subject}`, this.deps),
      name: bg.History.Events.HISTORY_CLEARED_EVENT,
      payload: { subject },
    }) satisfies bg.History.Events.HistoryClearedEventType;

    await this.deps.EventStore.saveAfter([event], tools.Duration.Ms(10));
  }
}

export function createHistoryWriter(deps: Dependencies): bg.History.Ports.HistoryWriterPort {
  return new HistoryWriterEventStore(deps);
}
