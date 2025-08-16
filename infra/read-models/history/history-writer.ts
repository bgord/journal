import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as History from "+history";
import { EventStore } from "+infra/event-store";

export class HistoryWriter implements History.Services.HistoryWriterPort {
  constructor(private readonly eventStore: typeof EventStore) {}

  async populate(history: History.VO.HistoryType) {
    const event = History.Events.HistoryPopulatedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: History.Events.HISTORY_POPULATED_EVENT,
      stream: "history",
      version: 1,
      payload: history,
    } satisfies History.Events.HistoryPopulatedEventType);

    await this.eventStore.save([event]);
  }

  async clear(subject: History.VO.HistorySubjectType) {
    const event = History.Events.HistoryClearedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: History.Events.HISTORY_CLEARED_EVENT,
      stream: "history",
      version: 1,
      payload: { subject },
    }) satisfies History.Events.HistoryClearedEventType;

    await this.eventStore.save([event]);
  }
}
