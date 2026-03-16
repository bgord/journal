import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

export function createDiskSpaceChecker(Env: EnvironmentResultType): bg.DiskSpaceCheckerPort {
  const DiskSpaceCheckerNoopAdapter = new bg.DiskSpaceCheckerNoopAdapter(tools.Size.fromGB(10));
  const DiskSpaceCheckerBunAdapter = new bg.DiskSpaceCheckerShellAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: DiskSpaceCheckerBunAdapter,
    [bg.NodeEnvironmentEnum.test]: DiskSpaceCheckerNoopAdapter,
    [bg.NodeEnvironmentEnum.staging]: DiskSpaceCheckerNoopAdapter,
    [bg.NodeEnvironmentEnum.production]: DiskSpaceCheckerBunAdapter,
  }[Env.type];
}
