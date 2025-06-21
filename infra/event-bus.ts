import * as bg from "@bgord/bun";
import Emittery from "emittery";
import z from "zod/v4";
import type { AcceptedEvent } from "./event-store";
import { logger } from "./logger";

const EventLogger = new bg.EventLogger(logger);

export type AcceptedEvents = z.infer<AcceptedEvent>;

export type EventMap = { [Event in AcceptedEvents as Event["name"]]: Event };

export const EventBus = new Emittery<EventMap>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
