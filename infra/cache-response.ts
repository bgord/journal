import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export function createCacheResponse(): bg.CacheResponse {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Hours(1) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  return new bg.CacheResponse({ enabled: false, subject: bg.CacheResponseSubjectUrl }, { CacheResolver });
}
