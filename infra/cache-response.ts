import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

type Dependencies = { HashContent: bg.HashContentPort };

export function createCacheResponse(deps: Dependencies): bg.CacheResponse {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Hours(1) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  return new bg.CacheResponse(
    {
      enabled: true,
      resolver: new bg.CacheSubjectResolver(
        [
          new bg.CacheSubjectSegmentFixed("cache_response"),
          new bg.CacheSubjectSegmentPath(),
          new bg.CacheSubjectSegmentCookie("language"),
          new bg.CacheSubjectSegmentUser(),
        ],
        deps,
      ),
    },
    { CacheResolver },
  );
}
