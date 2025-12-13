import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  JsonFileReader: bg.JsonFileReaderPort;
};

export function createImageProcessor(Env: EnvironmentType, deps: Dependencies): bg.ImageProcessorPort {
  const ImageProcessorSharp = new bg.ImageProcessorSharpAdapter(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
  }[Env.type];
}
