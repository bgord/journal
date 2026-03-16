import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as z from "zod/v4";
import type { AlarmEvent } from "+emotions/aggregates";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = AlarmEvent;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<z.infer<AcceptedEvent>> {
  const SseRegistry = new bg.SseRegistryAdapter<z.infer<AcceptedEvent>>();
  const SseRegistryWithLogger = new bg.SseRegistryWithLoggerAdapter<z.infer<AcceptedEvent>>({
    inner: SseRegistry,
    ...deps,
  });

  return new bg.SseRegistryWithLimitAdapter({
    inner: SseRegistryWithLogger,
    limit: tools.IntegerPositive.parse(3),
  });
}
