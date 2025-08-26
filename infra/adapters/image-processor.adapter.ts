import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

export const ImageProcessorSharp = new bg.ImageProcessorSharpAdapter();

export const ImageProcessor: bg.ImageProcessorPort = {
  [bg.NodeEnvironmentEnum.local]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.test]: new bg.ImageProcessorNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: ImageProcessorSharp,
  [bg.NodeEnvironmentEnum.production]: ImageProcessorSharp,
}[Env.type];
