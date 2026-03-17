import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { AlarmEventType } from "+emotions/aggregates";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = AlarmEventType;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<AcceptedEvent> {
  const SseRegistry = new bg.SseRegistryAdapter<AcceptedEvent>();
  const SseRegistryWithLogger = new bg.SseRegistryWithLoggerAdapter<AcceptedEvent>({
    inner: SseRegistry,
    ...deps,
  });

  return new bg.SseRegistryWithLimitAdapter({ inner: SseRegistryWithLogger, limit: tools.Int.positive(3) });
}
