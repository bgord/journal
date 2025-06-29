import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import type { AlarmEvent } from "../modules/emotions/aggregates/alarm";
import type { JournalEntryEvent } from "../modules/emotions/aggregates/emotion-journal-entry";
import type { WeeklyReviewEvent } from "../modules/emotions/aggregates/weekly-review";
import type { PatternDetectionEvent } from "../modules/emotions/services/patterns/pattern";
import { db } from "./db";
import { EventBus } from "./event-bus";
import * as schema from "./schema";

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
