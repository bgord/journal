import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const app = "journal";

const redactor = new bg.RedactorCompositeAdapter([
  new bg.RedactorMaskAdapter(bg.RedactorMaskAdapter.DEFAULT_KEYS),
  new bg.RedactorCompactArrayAdapter(),
  new bg.RedactorCompactObjectAdapter(),
]);

export const LoggerWinstonLocalAdapter = new bg.LoggerWinstonLocalAdapter({ app, redactor }).create(
  Env.LOGS_LEVEL,
);

export const LoggerWinstonProductionAdapter = new bg.LoggerWinstonProductionAdapter({
  app,
  AXIOM_API_TOKEN: Env.AXIOM_API_TOKEN,
  redactor,
});

export const Logger: bg.LoggerPort = {
  [bg.NodeEnvironmentEnum.local]: LoggerWinstonLocalAdapter,
  [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.production]: LoggerWinstonProductionAdapter.create(Env.LOGS_LEVEL),
}[Env.type];
