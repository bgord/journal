import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

export function createLogger(Env: EnvironmentType): bg.LoggerPort {
  const app = "journal";

  const redactor = new bg.RedactorCompositeAdapter([
    new bg.RedactorMaskAdapter(bg.RedactorMaskAdapter.DEFAULT_KEYS),
    new bg.RedactorCompactArrayAdapter(),
    new bg.RedactorCompactObjectAdapter(),
  ]);

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.LoggerWinstonLocalAdapter({ app, redactor }).create(
      Env.LOGS_LEVEL,
    ),
    [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.LoggerWinstonProductionAdapter({ app, redactor }).create(
      Env.LOGS_LEVEL,
    ),
  }[Env.type];
}
