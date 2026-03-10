import * as bg from "@bgord/bun";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = bg.History.Events.HistoryPopulatedEventType;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<AcceptedEvent> {
  const inner = new bg.SseRegistryAdapter();

  return new bg.SseRegistryWithLoggerAdapter({ inner, ...deps });
}
