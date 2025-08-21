import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const HealthcheckStore = new bg.NodeCacheRateLimitStore(tools.Time.Seconds(5));

export const EntriesDataStore = new bg.NodeCacheRateLimitStore(tools.Time.Minutes(1));

export const WeeklyReviewExportEmailStore = new bg.NodeCacheRateLimitStore(tools.Time.Minutes(1));
export const WeeklyReviewExportDownloadStore = new bg.NodeCacheRateLimitStore(tools.Time.Minutes(1));

export const ShareableLinkCreateStore = new bg.NodeCacheRateLimitStore(tools.Time.Minutes(1));
