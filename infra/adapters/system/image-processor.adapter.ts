import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileReaderJson: bg.FileReaderJsonPort;
};

export async function createImageProcessor(
  Env: EnvironmentType,
  deps: Dependencies,
): Promise<bg.ImageProcessorPort> {
  const ImageProcessorSharp = await bg.ImageProcessorSharpAdapter.build(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
    [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
  }[Env.type];
}
