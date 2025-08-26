import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

export const ImageFormatterSharp = new bg.ImageFormatterSharpAdapter();

export const ImageFormatter: bg.ImageFormatterPort = {
  [bg.NodeEnvironmentEnum.local]: ImageFormatterSharp,
  [bg.NodeEnvironmentEnum.test]: new bg.ImageFormatterNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: ImageFormatterSharp,
  [bg.NodeEnvironmentEnum.production]: ImageFormatterSharp,
}[Env.type];
