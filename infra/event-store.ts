import type { AlarmEvent, EntryEvent, WeeklyReviewEvent } from "+emotions/aggregates";
import type { PatternDetectionEvent } from "+emotions/services/patterns";
import { db } from "+infra/db";
import { EventBus } from "+infra/event-bus";
import * as schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod/v4";

export type AcceptedEvent = EntryEvent | PatternDetectionEvent | AlarmEvent | WeeklyReviewEvent;

export const EventStore = new bg.DispatchingEventStore<AcceptedEvent>(
  {
    finder: (stream: bg.EventStreamType, acceptedEventsNames: bg.EventNameType[]) =>
      db
        .select()
        .from(schema.events)
        .orderBy(asc(schema.events.revision))
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),
    inserter: async (_events: z.infer<bg.GenericParsedEventSchema>[]) => {
      const stream = _events?.[0]?.stream as bg.EventStreamType;

      // Events need to be resurfaced with the correct `revision` field.
      let events: z.infer<bg.GenericParsedEventSchema>[] = [];

      await db.transaction(async (tx) => {
        // @ts-expect-error
        const [{ current }] = await tx
          .select({ current: sql<number>`coalesce(max(${schema.events.revision}), -1)` })
          .from(schema.events)
          .where(eq(schema.events.stream, stream));

        let next = current + 1;
        events = _events.map((ev) => ({ ...ev, revision: next++ }));

        try {
          await tx.insert(schema.events).values(events);
        } catch (error: any) {
          if (error.code === "SQLITE_CONSTRAINT") {
            throw new tools.RevisionMismatchError();
          }

          throw error;
        }
      });

      return events;
    },
  },
  EventBus,
);
