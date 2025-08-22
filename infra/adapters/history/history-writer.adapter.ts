import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "+infra/event-store";

class HistoryWriterEventStore implements bg.History.Services.HistoryWriterPort {
  constructor(private readonly eventStore: typeof EventStore) {}

  async populate(history: Omit<bg.History.VO.HistoryType, "id">) {
    const event = bg.History.Events.HistoryPopulatedEvent.parse({
      ...bg.createEventEnvelope(`history_${history.subject}`),
      name: bg.History.Events.HISTORY_POPULATED_EVENT,
      payload: { ...history, id: crypto.randomUUID() },
    } satisfies bg.History.Events.HistoryPopulatedEventType);

    await this.eventStore.saveAfter([event], tools.Time.Ms(10));
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = bg.History.Events.HistoryClearedEvent.parse({
      ...bg.createEventEnvelope(`history_${subject}`),
      name: bg.History.Events.HISTORY_CLEARED_EVENT,
      payload: { subject },
    }) satisfies bg.History.Events.HistoryClearedEventType;

    await this.eventStore.saveAfter([event], tools.Time.Ms(10));
  }
}

export const HistoryWriter = new HistoryWriterEventStore(EventStore);
