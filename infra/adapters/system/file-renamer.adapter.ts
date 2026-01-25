import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createFileRenamer(Env: EnvironmentType): bg.FileRenamerPort {
  const FileRenamerFs = new bg.FileRenamerNodeAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: FileRenamerFs,
    [bg.NodeEnvironmentEnum.test]: new bg.FileRenamerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: FileRenamerFs,
    [bg.NodeEnvironmentEnum.production]: FileRenamerFs,
  }[Env.type];
}
