import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type * as z from "zod/v4";
import type { AiQuotaExceededEvent, AiRequestRegisteredEvent } from "+ai/events";
import type { AccountCreatedEvent, AccountDeletedEvent } from "+auth/events";
import type { AlarmEvent, EntryEvent, WeeklyReviewEvent } from "+emotions/aggregates";
import type {
  TimeCapsuleEntryScheduledEvent,
  WeeklyReviewExportByEmailFailedEvent,
  WeeklyReviewExportByEmailRequestedEvent,
} from "+emotions/events";
import type { PatternDetectionEvent } from "+emotions/services/patterns";
import { db } from "+infra/db";
import type { EnvironmentType } from "+infra/env";
import * as schema from "+infra/schema";
import type { ProfileAvatarRemovedEvent, ProfileAvatarUpdatedEvent } from "+preferences/events";
import type { ShareableLinkEvent } from "+publishing/aggregates";
import type { ShareableLinkAccessedEvent } from "+publishing/events";

type Dependencies = { EventBus: bg.EventBusPort<AcceptedEventType> };

export type AcceptedEvent =
  | EntryEvent
  | PatternDetectionEvent
  | AlarmEvent
  | WeeklyReviewEvent
  | ShareableLinkEvent
  | typeof AccountCreatedEvent
  | typeof AccountDeletedEvent
  | typeof AiQuotaExceededEvent
  | typeof AiRequestRegisteredEvent
  | typeof ProfileAvatarRemovedEvent
  | typeof ProfileAvatarUpdatedEvent
  | typeof ShareableLinkAccessedEvent
  | typeof TimeCapsuleEntryScheduledEvent
  | typeof WeeklyReviewExportByEmailFailedEvent
  | typeof WeeklyReviewExportByEmailRequestedEvent
  | typeof bg.System.Events.HourHasPassedEvent
  | typeof bg.System.Events.SecurityViolationDetectedEvent
  | typeof bg.History.Events.HistoryClearedEvent
  | typeof bg.History.Events.HistoryPopulatedEvent
  | typeof bg.Preferences.Events.UserLanguageSetEvent;

export type AcceptedEventType = z.infer<AcceptedEvent>;

export function createEventStore(deps: Dependencies): bg.EventStorePort<AcceptedEventType> {
  const revision = new bg.EventRevisionAssignerAdapter();
  const serializer = new bg.EventSerializerJsonAdapter();

  const finder: bg.EventFinderPort = {
    find: async (stream, names) =>
      db
        .select()
        .from(schema.events)
        .orderBy(asc(schema.events.revision))
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, names))),
  };

  const inserter: bg.EventInserterPort = {
    insert: async (incoming) => {
      const { stream } = incoming[0] as { stream: bg.EventStreamType };

      return db.transaction(async (tx) => {
        const current = await tx
          .select({ max: sql<number>`max(${schema.events.revision})` })
          .from(schema.events)
          .where(eq(schema.events.stream, stream));

        const max = current[0]?.max ?? bg.EventRevisionAssignerAdapter.EMPTY_STREAM_REVISION;

        const rows = revision.assign(incoming, max);

        try {
          await tx.insert(schema.events).values([...rows]);
          return rows;
        } catch (e: any) {
          if (e.code === "SQLITE_CONSTRAINT") throw new Error(tools.RevisionError.Mismatch);
          throw e;
        }
      });
    },
  };

  const inner = new bg.EventStoreAdapter<AcceptedEventType>({ finder, inserter, serializer });

  return new bg.EventStoreDispatchingAdapter<AcceptedEventType>({ inner, EventBus: deps.EventBus });
}
