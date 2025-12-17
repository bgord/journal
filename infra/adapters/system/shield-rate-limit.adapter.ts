import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createShieldRateLimit(Env: EnvironmentType, deps: Dependencies): bg.ShieldPort {
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Seconds(5) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  return new bg.ShieldRateLimitAdapter(
    { enabled: Env.type === bg.NodeEnvironmentEnum.production, subject: bg.RateLimitSubjectUser },
    { CacheResolver, ...deps },
  );
}
