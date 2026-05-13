import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileReaderJson: bg.FileReaderJsonPort;
  FileWriter: bg.FileWriterPort;
};

export function createImageProcessor(Env: EnvironmentResultType, deps: Dependencies): bg.ImageProcessorPort {
  const ImageProcessorSharp = new bg.ImageProcessorAdapter(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
  }[Env.type];
}
