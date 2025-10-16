import * as bg from "@bgord/bun";
import { FileCleaner } from "+infra/adapters/file-cleaner.adapter";
import { FileRenamer } from "+infra/adapters/file-renamer.adapter";
import { JsonFileReader } from "+infra/adapters/json-file-reader.adapter";
import { Env } from "+infra/env";

const deps = { FileCleaner, FileRenamer, JsonFileReader };

const ImageProcessorSharp = new bg.ImageProcessorSharpAdapter(deps);

export const ImageProcessor: bg.ImageProcessorPort = {
  [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
}[Env.type];
