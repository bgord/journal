import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createLogger(Env: EnvironmentType): bg.LoggerPort {
  const app = "journal";

  const redactor = new bg.RedactorCompositeStrategy([
    new bg.RedactorMaskStrategy(bg.RedactorMaskStrategy.DEFAULT_KEYS),
    new bg.RedactorCompactArrayStrategy(),
    new bg.RedactorCompactObjectStrategy(),
  ]);

  const config = { app, redactor };

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.LoggerWinstonLocalAdapter(config).create(Env.LOGS_LEVEL),
    [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.LoggerWinstonProductionAdapter(config).create(Env.LOGS_LEVEL),
  }[Env.type];
}
