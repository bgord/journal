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
        // TODO: .orderBy(asc(schema.events.createdAt), asc(schema.events.revision))?
        .orderBy(asc(schema.events.createdAt))
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),
    inserter: async (events: z.infer<bg.GenericParsedEventSchema>[]) => {
      const stream = events?.[0]?.stream as bg.EventStreamType;

      await db.transaction(async (tx) => {
        // @ts-expect-error
        const [{ current }] = await tx
          .select({ current: sql<number>`coalesce(max(${schema.events.revision}), -1)` })
          .from(schema.events)
          .where(eq(schema.events.stream, stream));

        let next = current + 1;
        const rows = events.map((event) => ({ ...event, revision: next++ }));

        try {
          await tx.insert(schema.events).values(rows);
        } catch (error: any) {
          if (error.code === "SQLITE_CONSTRAINT") {
            throw new tools.RevisionMismatchError();
          }

          throw error;
        }
      });
    },
  },
  EventBus,
);
