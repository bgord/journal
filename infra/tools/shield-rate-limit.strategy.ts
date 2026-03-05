import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createShieldRateLimit(Env: EnvironmentType, deps: Dependencies): bg.MiddlewareHonoPort {
  const ttl = tools.Duration.Seconds(30);
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "finite", ttl });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });
  const HashContent = new bg.HashContentSha256Strategy();

  const ShieldRateLimit = new bg.ShieldRateLimitHonoStrategy(
    {
      resolver: new bg.SubjectRequestResolver(
        [
          new bg.SubjectSegmentFixedStrategy("rate_limit"),
          new bg.SubjectSegmentPathStrategy(),
          new bg.SubjectSegmentUserStrategy(),
        ],
        { HashContent },
      ),
      window: ttl,
    },
    { CacheResolver, ...deps },
  );

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: ShieldRateLimit,
  }[Env.type];
}
