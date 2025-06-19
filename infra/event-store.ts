import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";

import { JournalEntryEvent } from "../modules/emotions/aggregates/emotion-journal-entry";
import { PatternDetectionEvent } from "../modules/emotions/services/patterns/pattern";
import { db } from "./db";
import * as schema from "./schema";

type AcceptedEvent = JournalEntryEvent | PatternDetectionEvent;

export const EventStore = new bg.EventStore<AcceptedEvent>({
  finder: (stream: bg.EventStreamType, acceptedEventsNames: bg.EventNameType[]) =>
    db
      .select()
      .from(schema.events)
      .orderBy(asc(schema.events.createdAt))
      .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),
  inserter: (events: z.infer<bg.GenericParsedEventSchema>[]) => db.insert(schema.events).values(events),
});
