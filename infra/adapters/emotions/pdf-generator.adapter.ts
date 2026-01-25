import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";
import { PdfGeneratorTinypdfAdapter } from "./pdf-generator-tinypdf.adapter";

type Dependencies = { Logger: bg.LoggerPort; Clock: bg.ClockPort };

export function createPdfGenerator(Env: EnvironmentType, deps: Dependencies): bg.PdfGeneratorPort {
  const PdfGenerator = new bg.PdfGeneratorWithLoggerAdapter({
    inner: new PdfGeneratorTinypdfAdapter(),
    ...deps,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: PdfGenerator,
    [bg.NodeEnvironmentEnum.test]: new bg.PdfGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.PdfGeneratorNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: PdfGenerator,
  }[Env.type];
}
