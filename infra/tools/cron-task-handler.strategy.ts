import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort; IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function createCronTaskHandler(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.CronTaskHandlerStrategy {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.CronTaskHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.test]: new bg.CronTaskHandlerNoopStrategy(),
    [bg.NodeEnvironmentEnum.staging]: new bg.CronTaskHandlerWithLoggerStrategy(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.CronTaskHandlerWithLoggerStrategy(deps),
  }[Env.type];
}
