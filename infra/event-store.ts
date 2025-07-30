import type { AlarmEvent, EntryEvent, WeeklyReviewEvent } from "+emotions/aggregates";
import type { WeeklyReviewExportByEmailRequestedEvent } from "+emotions/events";
import type { PatternDetectionEvent } from "+emotions/services/patterns";
import { db } from "+infra/db";
import { EventBus } from "+infra/event-bus";
import * as schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod/v4";

export type AcceptedEvent =
  | EntryEvent
  | PatternDetectionEvent
  | AlarmEvent
  | WeeklyReviewEvent
  | typeof WeeklyReviewExportByEmailRequestedEvent;

export const EventStore = new bg.DispatchingEventStore<AcceptedEvent>(
  {
    finder: (stream: bg.EventStreamType, acceptedEventsNames: bg.EventNameType[]) =>
      db
        .select()
        .from(schema.events)
        .orderBy(asc(schema.events.revision))
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames))),

    inserter: async (incoming: z.infer<bg.GenericParsedEventSchema>[]) => {
      const { stream } = incoming[0] as { stream: bg.EventStreamType };

      return db.transaction(async (tx) => {
        const current = await tx
          .select({ max: sql<number>`max(${schema.events.revision})` })
          .from(schema.events)
          .where(eq(schema.events.stream, stream));

        const max = current[0]?.max ?? bg.DispatchingEventStore.EMPTY_STREAM_REVISION;

        const rows: z.infer<bg.GenericParsedEventSchema>[] = incoming.map((event, order) => ({
          ...event,
          revision: max + order + 1,
        }));

        try {
          await tx.insert(schema.events).values(rows);
          return rows;
        } catch (e: any) {
          if (e.code === "SQLITE_CONSTRAINT") {
            throw new tools.RevisionMismatchError();
          }
          throw e;
        }
      });
    },
  },
  EventBus,
);
