import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createShieldRateLimit(Env: EnvironmentType, deps: Dependencies): bg.ShieldStrategy {
  const ttl = tools.Duration.Seconds(5);
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "finite", ttl });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });
  const HashContent = new bg.HashContentSha256BunStrategy();

  return new bg.ShieldRateLimitStrategy(
    {
      enabled: Env.type === bg.NodeEnvironmentEnum.production,
      resolver: new bg.CacheSubjectResolver(
        [
          new bg.CacheSubjectSegmentFixedStrategy("rate_limit"),
          new bg.CacheSubjectSegmentPathStrategy(),
          new bg.CacheSubjectSegmentUserStrategy(),
        ],
        { HashContent },
      ),
      window: ttl,
    },
    { CacheResolver, ...deps },
  );
}
