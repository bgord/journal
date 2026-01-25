import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createFileCleaner(Env: EnvironmentType): bg.FileCleanerPort {
  const FileCleanerBunForgiving = new bg.FileCleanerForgivingAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: FileCleanerBunForgiving,
    [bg.NodeEnvironmentEnum.test]: new bg.FileCleanerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: FileCleanerBunForgiving,
    [bg.NodeEnvironmentEnum.production]: FileCleanerBunForgiving,
  }[Env.type];
}
