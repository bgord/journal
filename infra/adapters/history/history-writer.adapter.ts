import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "+infra/event-store";

class HistoryWriterEventStore implements bg.History.Services.HistoryWriterPort {
  constructor(private readonly eventStore: typeof EventStore) {}

  async populate(history: Omit<bg.History.VO.HistoryType, "id">) {
    const event = bg.History.Events.HistoryPopulatedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: bg.History.Events.HISTORY_POPULATED_EVENT,
      stream: `history_${history.subject}`,
      version: 1,
      payload: { ...history, id: crypto.randomUUID() },
    } satisfies bg.History.Events.HistoryPopulatedEventType);

    await this.eventStore.saveAfter([event], tools.Time.Ms(10));
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = bg.History.Events.HistoryClearedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: bg.History.Events.HISTORY_CLEARED_EVENT,
      stream: `history_${subject}`,
      version: 1,
      payload: { subject },
    }) satisfies bg.History.Events.HistoryClearedEventType;

    await this.eventStore.saveAfter([event], tools.Time.Ms(10));
  }
}

export const HistoryWriter = new HistoryWriterEventStore(EventStore);
