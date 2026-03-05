import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Sleeper: bg.SleeperPort; Logger: bg.LoggerPort };

export function createShieldSecurity(Env: EnvironmentType, deps: Dependencies): bg.MiddlewareHonoPort {
  const HashContent = new bg.HashContentSha256Strategy();
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({
    type: "finite",
    ttl: tools.Duration.Minutes(5),
  });

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldSecurityHonoStrategy(
      [
        new bg.SecurityPolicy(
          new bg.SecurityRuleViolationThresholdStrategy(
            new bg.SecurityRuleBaitRoutesStrategy(["/api/.env"]),
            { threshold: tools.IntegerPositive.parse(3) },
            { ...deps, HashContent, CacheRepository },
          ),
          new bg.SecurityCountermeasureReportStrategy(deps),
        ),

        new bg.SecurityPolicy(
          new bg.SecurityRuleViolationThresholdStrategy(
            new bg.SecurityRuleUserAgentStrategy(),
            { threshold: tools.IntegerPositive.parse(3) },
            { ...deps, HashContent, CacheRepository },
          ),
          new bg.SecurityCountermeasureReportStrategy(deps),
        ),
      ],
      deps,
    ),
  }[Env.type];
}
