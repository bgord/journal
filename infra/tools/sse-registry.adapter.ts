import * as bg from "@bgord/bun";
import type * as z from "zod/v4";
import type { AlarmEvent } from "+emotions/aggregates";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = AlarmEvent;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<z.infer<AcceptedEvent>> {
  const inner = new bg.SseRegistryAdapter<z.infer<AcceptedEvent>>();

  return new bg.SseRegistryWithLoggerAdapter<z.infer<AcceptedEvent>>({ inner, ...deps });
}
