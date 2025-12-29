import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createTimeoutRunner(Env: EnvironmentType): bg.TimeoutRunnerPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.TimeoutRunnerBareAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.TimeoutRunnerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.TimeoutRunnerBareAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.TimeoutRunnerBareAdapter(),
  }[Env.type];
}
