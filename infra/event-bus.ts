import type { AcceptedEvent } from "+infra";
import { logger } from "+infra";
import * as bg from "@bgord/bun";
import Emittery from "emittery";
import z from "zod/v4";

const EventLogger = new bg.EventLogger(logger);

export const EventBus = new Emittery<bg.ToEventMap<z.infer<AcceptedEvent>>>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
