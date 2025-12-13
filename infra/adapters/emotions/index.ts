import type * as bg from "@bgord/bun";
import type { EventStoreType } from "+infra/adapters/system/event-store";
import type { EnvironmentType } from "+infra/env";
import { AlarmCancellationLookup } from "./alarm-cancellation-lookup.adapter";
import { AlarmDirectory } from "./alarm-directory.adapter";
import { createAlarmRepository } from "./alarm-repository.adapter";
import { EntriesPerWeekCount } from "./entries-per-week-count.adapter";
import { EntriesSharing } from "./entries-sharing.adapter";
import { createEntryRepository } from "./entry-repository.adapter";
import { EntrySnapshot } from "./entry-snapshot.adapter";
import { GetLatestEntryTimestampForUser } from "./get-latest-entry-timestamp-for-user.adapter";
import { createPdfGenerator } from "./pdf-generator.adapter";
import { TimeCapsuleDueEntries } from "./time-capsule-due-entries.adapter";
import { WeeklyReviewExport } from "./weekly-review-export.adapter";
import { createWeeklyReviewRepository } from "./weekly-review-repository.adapter";
import { WeeklyReviewSnapshot } from "./weekly-review-snapshot.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: EventStoreType;
  Logger: bg.LoggerPort;
};

export function createEmotionsAdapters(Env: EnvironmentType, deps: Dependencies) {
  const AlarmRepository = createAlarmRepository(deps);
  const EntryRepository = createEntryRepository(deps);
  const WeeklyReviewRepository = createWeeklyReviewRepository(deps);
  const PdfGenerator = createPdfGenerator(Env, deps);

  return {
    AlarmCancellationLookup,
    AlarmDirectory,
    AlarmRepository,
    EntriesPerWeekCount,
    EntriesSharing,
    EntryRepository,
    EntrySnapshot,
    GetLatestEntryTimestampForUser,
    TimeCapsuleDueEntries,
    WeeklyReviewExport,
    WeeklyReviewRepository,
    WeeklyReviewSnapshot,
    PdfGenerator,
  };
}
