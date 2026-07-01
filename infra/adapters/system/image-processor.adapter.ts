import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileReaderJson: bg.FileReaderJsonPort;
  FileWriter: bg.FileWriterPort;
  NonceProvider: bg.NonceProviderPort;
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
