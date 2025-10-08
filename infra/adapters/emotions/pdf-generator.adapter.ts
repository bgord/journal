import * as bg from "@bgord/bun";
import { LoggerWinstonLocalAdapter } from "+infra/adapters";
import { Env } from "+infra/env";
import { PdfGeneratorReact } from "./pdf-generator-react.adapter";

export const PdfGenerator: bg.PdfGeneratorPort = {
  [bg.NodeEnvironmentEnum.local]: new PdfGeneratorReact(),
  [bg.NodeEnvironmentEnum.test]: new bg.PdfGeneratorNoop(LoggerWinstonLocalAdapter),
  [bg.NodeEnvironmentEnum.staging]: new bg.PdfGeneratorNoop(LoggerWinstonLocalAdapter),
  [bg.NodeEnvironmentEnum.production]: new PdfGeneratorReact(),
}[Env.type];
