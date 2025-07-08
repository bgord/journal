import type { AlarmEvent, JournalEntryEvent, WeeklyReviewEvent } from "+emotions/aggregates";
import type { PatternDetectionEvent } from "+emotions/services/patterns";
import { db } from "+infra/db";
import { EventBus } from "+infra/event-bus";
import * as schema from "+infra/schema";
import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";

export type AcceptedEvent = JournalEntryEvent | PatternDetectionEvent | AlarmEvent | WeeklyReviewEvent;

export const EventStore = new bg.DispatchingEventStore<AcceptedEvent>(
  {
    finder: (stream: bg.EventStreamType, acceptedEventsNames: bg.EventNameType[]) =>
      db
        .select()
        .from(schema.events)
        .orderBy(asc(schema.events.createdAt))
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),
    inserter: (events: z.infer<bg.GenericParsedEventSchema>[]) => db.insert(schema.events).values(events),
  },
  EventBus,
);
