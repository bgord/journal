import * as bg from "@bgord/bun";
import Emittery from "emittery";
import type z from "zod/v4";
import type { AcceptedEvent } from "+infra/adapters/system/event-store";

type Dependencies = { Logger: bg.LoggerPort };

export function createEventBus(deps: Dependencies) {
  const EventLogger = new bg.EventLogger(deps);

  return new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
    debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
  });
}
