import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";

import { JournalEntryEvent } from "../modules/emotions/aggregates/emotion-journal-entry";
import { PatternDetectionEvent } from "../modules/emotions/services/patterns/pattern";
import { db } from "./db";
import { EventBus } from "./event-bus";
import * as schema from "./schema";

type AcceptedEvent = JournalEntryEvent | PatternDetectionEvent;

class DispatchingEventStore extends bg.EventStore<AcceptedEvent> {
  async save(events: z.infer<AcceptedEvent>[]) {
    await super.save(events);

    for (const event of events) {
      EventBus.emit(event.name, event);
    }
  }
}

export const EventStore = new DispatchingEventStore({
  finder: (stream: bg.EventStreamType, acceptedEventsNames: bg.EventNameType[]) =>
    db
      .select()
      .from(schema.events)
      .orderBy(asc(schema.events.createdAt))
      .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),
  inserter: (events: z.infer<bg.GenericParsedEventSchema>[]) => db.insert(schema.events).values(events),
});
