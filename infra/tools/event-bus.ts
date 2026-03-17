import * as bg from "@bgord/bun";
import type * as v from "valibot";
import type { AcceptedEvent } from "+infra/tools/event-store";

type Dependencies = { Logger: bg.LoggerPort };

export function createEventBus(deps: Dependencies): bg.EventBusPort<v.InferOutput<AcceptedEvent>> {
  const inner = new bg.CommandBusEmitteryAdapter<v.InferOutput<AcceptedEvent>>();

  return new bg.CommandBusWithLoggerAdapter<v.InferOutput<AcceptedEvent>>({ ...deps, inner });
}
