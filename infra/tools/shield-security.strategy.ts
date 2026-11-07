import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
  Logger: bg.LoggerPort;
  HashContent: bg.HashContentStrategy;
};

export function createShieldSecurity(Env: EnvironmentResultType, deps: Dependencies): bg.MiddlewareHonoPort {
  const CacheRepository = new bg.CacheRepositoryInMemoryAdapter(
    {
      type: "finite",
      ttl: tools.Duration.Minutes(5),
    },
    deps,
  );

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.MiddlewareHonoNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldSecurityHonoStrategy(
      [
        new bg.SecurityPolicy(
          new bg.SecurityRuleViolationThresholdStrategy(
            new bg.SecurityRuleBaitRoutesStrategy(["/api/.env"]),
            { threshold: tools.Int.positive(3), segments: [new bg.SubjectSegmentIpStrategy()] },
            { ...deps, CacheRepository },
          ),
          new bg.SecurityCountermeasureReportStrategy(deps),
        ),

        new bg.SecurityPolicy(
          new bg.SecurityRuleViolationThresholdStrategy(
            new bg.SecurityRuleUserAgentStrategy(),
            { threshold: tools.Int.positive(3), segments: [new bg.SubjectSegmentIpStrategy()] },
            { ...deps, CacheRepository },
          ),
          new bg.SecurityCountermeasureReportStrategy(deps),
        ),
      ],
      deps,
    ),
  }[Env.type];
}
