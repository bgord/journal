import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const HealthcheckStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Seconds(5));

export const EntriesDataStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Minutes(1));
export const EntriesEntriesStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Minutes(1));

export const WeeklyReviewExportEmailStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Minutes(1));
export const WeeklyReviewExportDownloadStore = new bg.RateLimitStoreNodeCacheAdapter(
  tools.Duration.Minutes(1),
);

export const ShareableLinkCreateStore = new bg.RateLimitStoreNodeCacheAdapter(tools.Duration.Minutes(1));
