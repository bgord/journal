import type * as bg from "@bgord/bun";
import type { createEventStore } from "+infra/adapters/system/event-store";
import type { EnvironmentType } from "+infra/env";
import { createAlarmCancellationLookup } from "./alarm-cancellation-lookup.adapter";
import { createAlarmDirectory } from "./alarm-directory.adapter";
import { createAlarmRepository } from "./alarm-repository.adapter";
import { createEntriesPerWeekCount } from "./entries-per-week-count.adapter";
import { createEntriesSharing } from "./entries-sharing.adapter";
import { createEntryRepository } from "./entry-repository.adapter";
import { createEntrySnapshot } from "./entry-snapshot.adapter";
import { createGetLatestEntryTimestampForUser } from "./get-latest-entry-timestamp-for-user.adapter";
import { createPdfGenerator } from "./pdf-generator.adapter";
import { createTimeCapsuleDueEntries } from "./time-capsule-due-entries.adapter";
import { createWeeklyReviewExport } from "./weekly-review-export.adapter";
import { createWeeklyReviewRepository } from "./weekly-review-repository.adapter";
import { createWeeklyReviewSnapshot } from "./weekly-review-snapshot.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: ReturnType<typeof createEventStore>;
  Logger: bg.LoggerPort;
};

export function createEmotionsAdapters(Env: EnvironmentType, deps: Dependencies) {
  const AlarmCancellationLookup = createAlarmCancellationLookup();
  const AlarmDirectory = createAlarmDirectory();
  const AlarmRepository = createAlarmRepository(deps);
  const EntriesPerWeekCount = createEntriesPerWeekCount();
  const EntriesSharing = createEntriesSharing();
  const EntryRepository = createEntryRepository(deps);
  const EntrySnapshot = createEntrySnapshot();
  const GetLatestEntryTimestampForUser = createGetLatestEntryTimestampForUser();
  const TimeCapsuleDueEntries = createTimeCapsuleDueEntries();
  const WeeklyReviewExport = createWeeklyReviewExport();
  const WeeklyReviewRepository = createWeeklyReviewRepository(deps);
  const WeeklyReviewSnapshot = createWeeklyReviewSnapshot();
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
