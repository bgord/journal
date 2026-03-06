import * as bg from "@bgord/bun";
import type z from "zod/v4";
import type { AcceptedEvent } from "+infra/tools/event-store";

type Dependencies = { Logger: bg.LoggerPort };

export function createEventBus(deps: Dependencies): bg.EventBusPort<z.infer<AcceptedEvent>> {
  const inner = new bg.CommandBusEmitteryV1Adapter<z.infer<AcceptedEvent>>();

  return new bg.CommandBusWithLoggerAdapter<z.infer<AcceptedEvent>>(inner, deps);
}
