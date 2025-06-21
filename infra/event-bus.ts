import * as bg from "@bgord/bun";
import Emittery from "emittery";
import z from "zod/v4";
import { JournalEntryEvent } from "../modules/emotions/aggregates/emotion-journal-entry";
import { PatternDetectionEvent } from "../modules/emotions/services/patterns";
import { logger } from "./logger";

const EventLogger = new bg.EventLogger(logger);

export type Events = z.infer<JournalEntryEvent> | z.infer<PatternDetectionEvent>;

export type EventMap = {
  [Event in Events as Event["name"]]: Event;
};

export const EventBus = new Emittery<EventMap>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
