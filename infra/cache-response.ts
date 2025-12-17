import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export function createCacheResponse() {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Hours(1) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  return new bg.CacheResponse({ enabled: true, subject: bg.CacheResponseSubjectUrl }, { CacheResolver });
}
