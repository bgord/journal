import * as bg from "@bgord/bun";
import type { EventBusType } from "+infra/adapters/system/event-bus";

type Dependencies = {
  EventBus: EventBusType;
  EventHandler: bg.EventHandlerPort;
  HistoryProjection: bg.History.Ports.HistoryProjectionPort;
};

export class HistoryProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      bg.History.Events.HISTORY_POPULATED_EVENT,
      deps.EventHandler.handle(bg.History.EventHandlers.onHistoryPopulatedEvent(deps.HistoryProjection)),
    );
    deps.EventBus.on(
      bg.History.Events.HISTORY_CLEARED_EVENT,
      deps.EventHandler.handle(bg.History.EventHandlers.onHistoryClearedEvent(deps.HistoryProjection)),
    );
  }
}
