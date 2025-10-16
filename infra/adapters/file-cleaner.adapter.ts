import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const FileCleanerBunForgiving = new bg.FileCleanerBunForgivingAdapter();

export const FileCleaner: bg.FileCleanerPort = {
  [bg.NodeEnvironmentEnum.local]: FileCleanerBunForgiving,
  [bg.NodeEnvironmentEnum.test]: new bg.FileCleanerNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: FileCleanerBunForgiving,
  [bg.NodeEnvironmentEnum.production]: FileCleanerBunForgiving,
}[Env.type];
