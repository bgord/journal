import * as bg from "@bgord/bun";
import { LoggerWinstonLocalAdapter } from "+infra/adapters";
import { Env } from "+infra/env";
import { PdfGeneratorReactAdapter } from "./pdf-generator-react.adapter";

export const PdfGenerator: bg.PdfGeneratorPort = {
  [bg.NodeEnvironmentEnum.local]: new PdfGeneratorReactAdapter(),
  [bg.NodeEnvironmentEnum.test]: new bg.PdfGeneratorNoopAdapter(LoggerWinstonLocalAdapter),
  [bg.NodeEnvironmentEnum.staging]: new bg.PdfGeneratorNoopAdapter(LoggerWinstonLocalAdapter),
  [bg.NodeEnvironmentEnum.production]: new PdfGeneratorReactAdapter(),
}[Env.type];
