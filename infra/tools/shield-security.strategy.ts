import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Sleeper: bg.SleeperPort; Logger: bg.LoggerPort };

export function createShieldSecurity(Env: EnvironmentType, deps: Dependencies): bg.ShieldStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.ShieldSecurityStrategy(
      [
        new bg.SecurityPolicy(
          new bg.SecurityRuleBaitRoutesStrategy(["/api/.env"]),
          new bg.SecurityCountermeasureReportStrategy(deps),
        ),
      ],
      deps,
    ),
    [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.ShieldNoopStrategy(),
    [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopStrategy(),
  }[Env.type];
}
