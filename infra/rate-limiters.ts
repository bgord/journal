import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const HealthcheckStore = new bg.RateLimitStoreNodeCache(tools.Time.Seconds(5));

export const EntriesDataStore = new bg.RateLimitStoreNodeCache(tools.Time.Minutes(1));
export const EntriesEntriesStore = new bg.RateLimitStoreNodeCache(tools.Time.Minutes(1));

export const WeeklyReviewExportEmailStore = new bg.RateLimitStoreNodeCache(tools.Time.Minutes(1));
export const WeeklyReviewExportDownloadStore = new bg.RateLimitStoreNodeCache(tools.Time.Minutes(1));

export const ShareableLinkCreateStore = new bg.RateLimitStoreNodeCache(tools.Time.Minutes(1));
