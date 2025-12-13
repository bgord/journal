import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";
import { PdfGeneratorReactAdapter } from "./pdf-generator-react.adapter";

type Dependencies = { Logger: bg.LoggerPort };

export function createPdfGenerator(Env: EnvironmentType, deps: Dependencies): bg.PdfGeneratorPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new PdfGeneratorReactAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.PdfGeneratorNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.staging]: new bg.PdfGeneratorNoopAdapter(deps),
    [bg.NodeEnvironmentEnum.production]: new PdfGeneratorReactAdapter(),
  }[Env.type];
}
