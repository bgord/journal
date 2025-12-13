import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { z } from "zod/v4";
import type { AiQuotaExceededEvent, AiRequestRegisteredEvent } from "+ai/events";
import type { AccountCreatedEvent, AccountDeletedEvent } from "+auth/events";
import type { AlarmEvent, EntryEvent, WeeklyReviewEvent } from "+emotions/aggregates";
import type {
  TimeCapsuleEntryScheduledEvent,
  WeeklyReviewExportByEmailFailedEvent,
  WeeklyReviewExportByEmailRequestedEvent,
} from "+emotions/events";
import type { PatternDetectionEvent } from "+emotions/services/patterns";
import type { createEventBus } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as schema from "+infra/schema";
import type { ProfileAvatarRemovedEvent, ProfileAvatarUpdatedEvent } from "+preferences/events";
import type { ShareableLinkEvent } from "+publishing/aggregates";
import type { ShareableLinkAccessedEvent } from "+publishing/events";
import type { HourHasPassedEvent } from "+system/events";

type Dependencies = { EventBus: ReturnType<typeof createEventBus> };

export type AcceptedEvent =
  | EntryEvent
  | PatternDetectionEvent
  | AlarmEvent
  | WeeklyReviewEvent
  | typeof WeeklyReviewExportByEmailRequestedEvent
  | typeof WeeklyReviewExportByEmailFailedEvent
  | typeof TimeCapsuleEntryScheduledEvent
  | ShareableLinkEvent
  | typeof ShareableLinkAccessedEvent
  | typeof HourHasPassedEvent
  | typeof AiRequestRegisteredEvent
  | typeof AiQuotaExceededEvent
  | typeof AccountCreatedEvent
  | typeof AccountDeletedEvent
  | typeof bg.History.Events.HistoryClearedEvent
  | typeof bg.History.Events.HistoryPopulatedEvent
  | typeof bg.Preferences.Events.UserLanguageSetEvent
  | typeof ProfileAvatarUpdatedEvent
  | typeof ProfileAvatarRemovedEvent;

export function createEventStore(deps: Dependencies) {
  return new bg.DispatchingEventStore<AcceptedEvent>(
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
            if (e.code === "SQLITE_CONSTRAINT") throw new Error(tools.RevisionError.Mismatch);
            throw e;
          }
        });
      },
    },
    deps.EventBus,
  );
}
