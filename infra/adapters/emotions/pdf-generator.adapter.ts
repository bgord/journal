import * as bg from "@bgord/bun";
import { Env } from "+infra/env";
import { PdfGeneratorNoop } from "./pdf-generator-noop.adapter";
import { PdfGeneratorReact } from "./pdf-generator-react.adapter";

export const PdfGenerator =
  Env.type === bg.NodeEnvironmentEnum.local ? new PdfGeneratorReact() : new PdfGeneratorNoop();
