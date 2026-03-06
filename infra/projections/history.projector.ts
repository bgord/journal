import * as bg from "@bgord/bun";

type Dependencies = {
  EventBus: bg.EventBusPort<
    bg.History.Events.HistoryClearedEventType | bg.History.Events.HistoryPopulatedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
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
