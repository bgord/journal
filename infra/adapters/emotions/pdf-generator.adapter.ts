import * as bg from "@bgord/bun";
import { Env } from "+infra/env";
import { LoggerWinstonLocalAdapter } from "+infra/logger.adapter";
import { PdfGeneratorReact } from "./pdf-generator-react.adapter";

export const PdfGenerator =
  Env.type === bg.NodeEnvironmentEnum.local
    ? new PdfGeneratorReact()
    : new bg.PdfGeneratorNoop(LoggerWinstonLocalAdapter);
