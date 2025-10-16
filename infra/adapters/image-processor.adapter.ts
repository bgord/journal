import * as bg from "@bgord/bun";
import { FileCleaner, FileRenamer, JsonFileReader } from "+infra/adapters";
import { Env } from "+infra/env";

const deps = { FileCleaner, FileRenamer, JsonFileReader };

const ImageProcessorSharp = new bg.ImageProcessorSharpAdapter(deps);

export const ImageProcessor: bg.ImageProcessorPort = {
  [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
}[Env.type];
