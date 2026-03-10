import * as bg from "@bgord/bun";
import type * as z from "zod/v4";
import type { EntryEvent } from "+emotions/aggregates";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedEvent = EntryEvent;

export function createSseRegistry(deps: Dependencies): bg.SseRegistryPort<z.infer<AcceptedEvent>> {
  const inner = new bg.SseRegistryAdapter();

  return new bg.SseRegistryWithLoggerAdapter({ inner, ...deps });
}
