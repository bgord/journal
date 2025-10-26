import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const DiskSpaceCheckerNoopAdapter = new bg.DiskSpaceCheckerNoopAdapter(tools.Size.fromGB(10));
const DiskSpaceCheckerBunAdapter = new bg.DiskSpaceCheckerBunAdapter();

export const DiskSpaceChecker: bg.DiskSpaceCheckerPort = {
  [bg.NodeEnvironmentEnum.local]: DiskSpaceCheckerBunAdapter,
  [bg.NodeEnvironmentEnum.test]: DiskSpaceCheckerNoopAdapter,
  [bg.NodeEnvironmentEnum.staging]: DiskSpaceCheckerNoopAdapter,
  [bg.NodeEnvironmentEnum.production]: DiskSpaceCheckerBunAdapter,
}[Env.type];
