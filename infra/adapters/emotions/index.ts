import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { EnvironmentResultType } from "+infra/env";
import { AlarmCancellationLookup } from "./alarm-cancellation-lookup.adapter";
import { AlarmDirectory } from "./alarm-directory.adapter";
import { DashboardQuery } from "./dashboard.adapter";
import { EntriesPerWeekCountQuery } from "./entries-per-week-count.adapter";
import { EntriesSharingOHQ } from "./entries-sharing.adapter";
import { EntrySnapshot } from "./entry-snapshot.adapter";
import { GetLatestEntryTimestampForUserQuery } from "./get-latest-entry-timestamp-for-user.adapter";
import { createPdfGenerator } from "./pdf-generator.adapter";
import { TimeCapsuleDueEntries } from "./time-capsule-due-entries.adapter";
import { WeeklyReviewExportQuery } from "./weekly-review-export.adapter";
import { WeeklyReviewSnapshot } from "./weekly-review-snapshot.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<
    | Emotions.Aggregates.AlarmEventType
    | Emotions.Aggregates.EntryEventType
    | Emotions.Aggregates.WeeklyReviewEventType
  >;
  Logger: bg.LoggerPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export function createEmotionsAdapters(Env: EnvironmentResultType, deps: Dependencies) {
  const PdfGenerator = createPdfGenerator(Env, deps);

  return {
    AlarmCancellationLookup,
    AlarmDirectory,
    AlarmRepository: new bg.EventSourcedRepositoryAdapter({ aggregate: Emotions.Aggregates.Alarm }, deps),
    DashboardQuery,
    EntriesPerWeekCountQuery,
    EntriesSharingOHQ,
    EntryRepository: new bg.EventSourcedRepositoryAdapter({ aggregate: Emotions.Aggregates.Entry }, deps),
    EntrySnapshot,
    GetLatestEntryTimestampForUserQuery,
    TimeCapsuleDueEntries,
    WeeklyReviewExportQuery,
    WeeklyReviewRepository: new bg.EventSourcedRepositoryAdapter(
      { aggregate: Emotions.Aggregates.WeeklyReview },
      deps,
    ),
    WeeklyReviewSnapshot,
    PdfGenerator,
  };
}
