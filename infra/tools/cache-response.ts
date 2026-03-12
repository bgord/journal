import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

type Dependencies = { HashContent: bg.HashContentStrategy };

export function createCacheResponse(deps: Dependencies): bg.MiddlewareHonoPort {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({
    type: "finite",
    ttl: tools.Duration.Hours(1),
  });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });

  return new bg.CacheResponseHonoMiddleware(
    {
      enabled: true,
      resolver: new bg.SubjectRequestResolver(
        [
          new bg.SubjectSegmentFixedStrategy("cache_response"),
          new bg.SubjectSegmentPathStrategy(),
          new bg.SubjectSegmentCookieStrategy("language"),
          new bg.SubjectSegmentUserStrategy(),
        ],
        deps,
      ),
    },
    { CacheResolver },
  );
}
