import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort; IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function createJobHandler(Env: EnvironmentResultType, deps: Dependencies): bg.JobHandlerStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.JobHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.test]: new bg.JobHandlerNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.JobHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.JobHandlerWithLoggerStrategy(deps),
  }[Env.type];
}
