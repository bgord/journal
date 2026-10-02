import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  AtomicFileWriter: bg.AtomicFileWriterPort;
  FileCleaner: bg.FileCleanerPort;
  FileReaderJson: bg.FileReaderJsonPort;
};

export function createImageProcessor(Env: EnvironmentResultType, deps: Dependencies): bg.ImageProcessorPort {
  const ImageProcessor = new bg.ImageProcessorAdapter(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: ImageProcessor,
    [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: ImageProcessor,
    [bg.NodeEnvironmentEnum.production]: ImageProcessor,
  }[Env.type];
}
