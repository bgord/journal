import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { AlarmEvent } from "+emotions/aggregates";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = AlarmEvent;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<v.InferOutput<AcceptedEvent>> {
  const SseRegistry = new bg.SseRegistryAdapter<v.InferOutput<AcceptedEvent>>();
  const SseRegistryWithLogger = new bg.SseRegistryWithLoggerAdapter<v.InferOutput<AcceptedEvent>>({
    inner: SseRegistry,
    ...deps,
  });

  return new bg.SseRegistryWithLimitAdapter({
    inner: SseRegistryWithLogger,
    limit: v.parse(tools.IntegerPositive, 3),
  });
}
