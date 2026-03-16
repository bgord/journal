import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createTimekeeper(Env: EnvironmentResultType, deps: Dependencies): bg.TimekeeperPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.TimekeeperGoogleAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.TimekeeperNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.staging]: new bg.TimekeeperGoogleAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.TimekeeperGoogleAdapter(),
  }[Env.type];
}
