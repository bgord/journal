import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  Clock: bg.ClockPort;
  Sleeper: bg.SleeperPort;
  IdProvider: bg.IdProviderPort;
  Logger: bg.LoggerPort;
  EventStore: bg.EventStoreLike<bg.System.Events.SecurityViolationDetectedEventType>;
};

export function createShieldSecurity(
  Env: EnvironmentType,
  deps: Dependencies,
): { Shield: bg.ShieldStrategy; BaitRoutes: string[] } {
  const BaitRoutes = ["/.env"];

  return {
    Shield: {
      [bg.NodeEnvironmentEnum.local]: new bg.ShieldSecurityStrategy(
        [
          new bg.SecurityPolicy(
            new bg.SecurityRuleBaitRoutesStrategy(BaitRoutes),
            new bg.SecurityCountermeasureBanStrategy(deps),
          ),
        ],
        deps,
      ),
      [bg.NodeEnvironmentEnum.test]: new bg.ShieldNoopStrategy(),
      [bg.NodeEnvironmentEnum.staging]: new bg.ShieldNoopStrategy(),
      [bg.NodeEnvironmentEnum.production]: new bg.ShieldNoopStrategy(),
    }[Env.type],
    BaitRoutes,
  };
}
