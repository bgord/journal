import * as bg from "@bgord/bun";
import Emittery from "emittery";
import type z from "zod/v4";
import { Logger } from "+infra/adapters/logger.adapter";
import type { AcceptedEvent } from "+infra/event-store";

const EventLogger = new bg.EventLogger({ Logger });

export const EventBus = new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
