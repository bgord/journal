import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

export function createDiskSpaceChecker(Env: EnvironmentResultType): bg.DiskSpaceCheckerPort {
  const DiskSpaceCheckerNoopAdapter = new bg.DiskSpaceCheckerNoopAdapter(tools.Size.fromGB(10));
  const DiskSpaceCheckerFsAdapter = new bg.DiskSpaceCheckerFsAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: DiskSpaceCheckerFsAdapter,
    [bg.NodeEnvironmentEnum.test]: DiskSpaceCheckerNoopAdapter,
    [bg.NodeEnvironmentEnum.staging]: DiskSpaceCheckerNoopAdapter,
    [bg.NodeEnvironmentEnum.production]: DiskSpaceCheckerFsAdapter,
  }[Env.type];
}
