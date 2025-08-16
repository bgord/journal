import * as bg from "@bgord/bun";
import type { EventBus } from "+infra/event-bus";

export class HistoryProjector {
  constructor(eventBus: typeof EventBus, historyRepository: bg.History.Repos.HistoryRepositoryPort) {
    eventBus.on(
      bg.History.Events.HISTORY_POPULATED_EVENT,
      bg.History.EventHandlers.onHistoryPopulatedEvent(historyRepository),
    );
    eventBus.on(
      bg.History.Events.HISTORY_CLEARED_EVENT,
      bg.History.EventHandlers.onHistoryClearedEvent(historyRepository),
    );
  }
}
