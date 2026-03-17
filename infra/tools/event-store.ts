import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { AiQuotaExceededEventType, AiRequestRegisteredEventType } from "+ai/events";
import type { AccountCreatedEventType, AccountDeletedEventType } from "+auth/events";
import type { AlarmEventType, EntryEventType, WeeklyReviewEventType } from "+emotions/aggregates";
import type {
  TimeCapsuleEntryScheduledEventType,
  WeeklyReviewExportByEmailFailedEventType,
  WeeklyReviewExportByEmailRequestedEventType,
} from "+emotions/events";
import type { PatternDetectionEventType } from "+emotions/services/patterns";
import { db } from "+infra/db";
import type { EnvironmentResultType } from "+infra/env";
import * as schema from "+infra/schema";
import type { ProfileAvatarRemovedEventType, ProfileAvatarUpdatedEventType } from "+preferences/events";
import type { ShareableLinkEventType } from "+publishing/aggregates";
import type { ShareableLinkAccessedEventType } from "+publishing/events";

type Dependencies = { EventBus: bg.EventBusPort<AcceptedEventType>; Logger: bg.LoggerPort };

export type AcceptedEventType =
  | EntryEventType
  | PatternDetectionEventType
  | AlarmEventType
  | WeeklyReviewEventType
  | ShareableLinkEventType
  | AccountCreatedEventType
  | AccountDeletedEventType
  | AiQuotaExceededEventType
  | AiRequestRegisteredEventType
  | ProfileAvatarRemovedEventType
  | ProfileAvatarUpdatedEventType
  | ShareableLinkAccessedEventType
  | TimeCapsuleEntryScheduledEventType
  | WeeklyReviewExportByEmailFailedEventType
  | WeeklyReviewExportByEmailRequestedEventType
  | bg.System.Events.HourHasPassedEventType
  | bg.System.Events.SecurityViolationDetectedEventType
  | bg.History.Events.HistoryClearedEventType
  | bg.History.Events.HistoryPopulatedEventType
  | bg.Preferences.Events.UserLanguageSetEventType;

export function createEventStore(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.EventStorePort<AcceptedEventType> {
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

        const rows = revision.assign(incoming, current[0]?.max);

        try {
          await tx.insert(schema.events).values([...rows]);

          return rows;
        } catch (error: any) {
          if (error.code === "SQLITE_CONSTRAINT") throw new Error(tools.RevisionError.Mismatch);
          throw error;
        }
      });
    },
  };

  const EventStore = new bg.EventStoreAdapter<AcceptedEventType>({ finder, inserter, serializer });

  const EventStoreDispatching = new bg.EventStoreDispatchingAdapter<AcceptedEventType>({
    inner: EventStore,
    ...deps,
  });

  const EventStoreWithLogger = new bg.EventStoreWithLoggerAdapter<AcceptedEventType>({
    inner: EventStoreDispatching,
    ...deps,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: EventStoreWithLogger,
    [bg.NodeEnvironmentEnum.test]: new bg.EventStoreAdapter<AcceptedEventType>({
      finder,
      inserter: new bg.EventInserterNoopAdapter(),
      serializer,
    }),
    [bg.NodeEnvironmentEnum.staging]: EventStoreWithLogger,
    [bg.NodeEnvironmentEnum.production]: EventStoreWithLogger,
  }[Env.type];
}
