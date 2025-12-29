import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort; IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function createJobHandler(Env: EnvironmentType, deps: Dependencies): bg.JobHandlerStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.JobHandlerNoopStrategy(),
    [bg.NodeEnvironmentEnum.test]: new bg.JobHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.staging]: new bg.JobHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.JobHandlerWithLoggerStrategy(deps),
  }[Env.type];
}
