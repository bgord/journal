import * as bg from "@bgord/bun";
import { LoggerWinstonLocalAdapter } from "+infra/adapters";
import { Env } from "+infra/env";
import { PdfGeneratorReact } from "./pdf-generator-react.adapter";

export const PdfGenerator =
  Env.type === bg.NodeEnvironmentEnum.local
    ? new PdfGeneratorReact()
    : new bg.PdfGeneratorNoop(LoggerWinstonLocalAdapter);
