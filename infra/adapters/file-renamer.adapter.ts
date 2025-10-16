import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const FileRenamerFs = new bg.FileRenamerFsAdapter();

export const FileRenamer: bg.FileRenamerPort = {
  [bg.NodeEnvironmentEnum.local]: FileRenamerFs,
  [bg.NodeEnvironmentEnum.test]: new bg.FileRenamerNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: FileRenamerFs,
  [bg.NodeEnvironmentEnum.production]: FileRenamerFs,
}[Env.type];
