import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createShieldRateLimit(
  Env: EnvironmentType,
  deps: Dependencies,
): {
  Healthcheck: bg.ShieldPort;
  EntryDataExport: bg.ShieldPort;
  EntryExportEntries: bg.ShieldPort;
  WeeklyReviewExportEmail: bg.ShieldPort;
  WeeklyReviewExportDownload: bg.ShieldPort;
  PublishingLinkCreate: bg.ShieldPort;
} {
  const enabled = Env.type === bg.NodeEnvironmentEnum.production;

  const HealthcheckStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));
  const EntryDataExportStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));
  const EntryExportEntriesStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));
  const WeeklyReviewExportEmailStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));
  const WeeklyReviewExportDownloadStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));
  const PublishingLinkCreateStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));

  return {
    Healthcheck: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.AnonSubjectResolver, store: HealthcheckStore },
      deps,
    ),
    EntryDataExport: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.UserSubjectResolver, store: EntryDataExportStore },
      deps,
    ),
    EntryExportEntries: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.UserSubjectResolver, store: EntryExportEntriesStore },
      deps,
    ),
    WeeklyReviewExportEmail: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.UserSubjectResolver, store: WeeklyReviewExportEmailStore },
      deps,
    ),

    WeeklyReviewExportDownload: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.UserSubjectResolver, store: WeeklyReviewExportDownloadStore },
      deps,
    ),
    PublishingLinkCreate: new bg.ShieldRateLimitAdapter(
      { enabled, subject: bg.UserSubjectResolver, store: PublishingLinkCreateStore },
      deps,
    ),
  };
}
