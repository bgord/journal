import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "+infra/event-store";
import * as History from "../";

export class HistoryPopulator {
  static async populate(payload: History.Events.HistoryPopulatedEventType["payload"]) {
    const event = History.Events.HistoryPopulatedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: History.Events.HISTORY_POPULATED_EVENT,
      stream: "history",
      version: 1,
      payload: payload,
    } satisfies History.Events.HistoryPopulatedEventType);

    return EventStore.save([event]);
  }

  static async clear(payload: History.Events.HistoryClearedEventType["payload"]) {
    const event = History.Events.HistoryClearedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: History.Events.HISTORY_CLEARED_EVENT,
      stream: "history",
      version: 1,
      payload,
    }) satisfies History.Events.HistoryClearedEventType;

    return EventStore.save([event]);
  }
}
