import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const JsonFileReaderBunForgiving = new bg.JsonFileReaderBunForgivingAdapter();

export const JsonFileReader: bg.JsonFileReaderPort = {
  [bg.NodeEnvironmentEnum.local]: JsonFileReaderBunForgiving,
  [bg.NodeEnvironmentEnum.test]: JsonFileReaderBunForgiving,
  [bg.NodeEnvironmentEnum.staging]: JsonFileReaderBunForgiving,
  [bg.NodeEnvironmentEnum.production]: JsonFileReaderBunForgiving,
}[Env.type];
