import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const DiskSpaceCheckerNoopAdapter = new bg.DiskSpaceCheckerNoopAdapter(tools.Size.fromMB(10));
const DiskSpaceCheckerPackageAdapter = new bg.DiskSpaceCheckerPackageAdapter();

export const DiskSpaceChecker: bg.DiskSpaceCheckerPort = {
  [bg.NodeEnvironmentEnum.local]: DiskSpaceCheckerPackageAdapter,
  [bg.NodeEnvironmentEnum.test]: DiskSpaceCheckerNoopAdapter,
  [bg.NodeEnvironmentEnum.staging]: DiskSpaceCheckerNoopAdapter,
  [bg.NodeEnvironmentEnum.production]: DiskSpaceCheckerPackageAdapter,
}[Env.type];
