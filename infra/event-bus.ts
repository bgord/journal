import * as bg from "@bgord/bun";
import Emittery from "emittery";
import type z from "zod/v4";
import type { AcceptedEvent } from "+infra/event-store";
import { logger } from "+infra/logger.adapter";

const EventLogger = new bg.EventLogger(logger);

export const EventBus = new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
