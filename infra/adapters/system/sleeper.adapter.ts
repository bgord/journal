import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createSleeper(Env: EnvironmentResultType): bg.SleeperPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.SleeperSystemAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.SleeperNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.SleeperSystemAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.SleeperSystemAdapter(),
  }[Env.type];
}
