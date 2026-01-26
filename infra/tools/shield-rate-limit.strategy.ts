import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createShieldRateLimit(Env: EnvironmentType, deps: Dependencies): bg.ShieldStrategy {
  const ttl = tools.Duration.Seconds(30);
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "finite", ttl });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });
  const HashContent = new bg.HashContentSha256Strategy();

  const ShieldRateLimit = new bg.ShieldRateLimitStrategy(
    {
      resolver: new bg.CacheSubjectRequestResolver(
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

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.production]: ShieldRateLimit,
  }[Env.type];
}
