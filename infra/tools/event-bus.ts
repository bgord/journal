import * as bg from "@bgord/bun";
import type { AcceptedEventType } from "+infra/tools/event-store";

type Dependencies = { Logger: bg.LoggerPort };

export function createEventBus(deps: Dependencies): bg.EventBusPort<AcceptedEventType> {
  const inner = new bg.CommandBusEmitteryAdapter<AcceptedEventType>();

  return new bg.CommandBusWithLoggerAdapter<AcceptedEventType>({ ...deps, inner });
}
