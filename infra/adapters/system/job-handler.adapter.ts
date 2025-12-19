import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Logger: bg.LoggerPort; IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function createJobHandler(Env: EnvironmentType, deps: Dependencies): bg.JobHandlerPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.JobHandlerNoop(),
    [bg.NodeEnvironmentEnum.test]: new bg.JobHandlerWithLogger(deps),
    [bg.NodeEnvironmentEnum.staging]: new bg.JobHandlerWithLogger(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.JobHandlerWithLogger(deps),
  }[Env.type];
}
