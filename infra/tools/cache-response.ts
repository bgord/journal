import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export function createCacheResponse(): bg.CacheResponse {
  const HashContent = new bg.HashContentSha256BunStrategy();
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({
    type: "finite",
    ttl: tools.Duration.Hours(1),
  });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });

  return new bg.CacheResponse(
    {
      enabled: true,
      resolver: new bg.CacheSubjectResolver(
        [
          new bg.CacheSubjectSegmentFixedStrategy("cache_response"),
          new bg.CacheSubjectSegmentPathStrategy(),
          new bg.CacheSubjectSegmentCookieStrategy("language"),
          new bg.CacheSubjectSegmentUserStrategy(),
        ],
        { HashContent },
      ),
    },
    { CacheResolver },
  );
}
