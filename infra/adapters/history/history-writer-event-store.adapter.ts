import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "+infra/event-store";

export class HistoryWriterEventStore implements bg.History.Services.HistoryWriterPort {
  constructor(private readonly eventStore: typeof EventStore) {}

  async populate(history: Omit<bg.History.VO.HistoryType, "id">) {
    const id = crypto.randomUUID();
    const event = bg.History.Events.HistoryPopulatedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: bg.History.Events.HISTORY_POPULATED_EVENT,
      stream: "history",
      version: 1,
      payload: { ...history, id },
    } satisfies bg.History.Events.HistoryPopulatedEventType);

    await this.eventStore.save([event]);
  }

  async clear(subject: bg.History.VO.HistorySubjectType) {
    const event = bg.History.Events.HistoryClearedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: bg.History.Events.HISTORY_CLEARED_EVENT,
      stream: "history",
      version: 1,
      payload: { subject },
    }) satisfies bg.History.Events.HistoryClearedEventType;

    await this.eventStore.save([event]);
  }
}
