import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const app = "lobbygow";

const redactor = new bg.RedactorCompositeAdapter([
  new bg.RedactorMaskAdapter(bg.RedactorMaskAdapter.DEFAULT_KEYS),
  new bg.RedactorCompactAdapter(),
]);

export const LoggerWinstonLocalAdapter = new bg.LoggerWinstonLocalAdapter({ app, redactor }).create(
  Env.LOGS_LEVEL,
);

export const LoggerWinstonProductionAdapter = new bg.LoggerWinstonProductionAdapter({
  app,
  AXIOM_API_TOKEN: Env.AXIOM_API_TOKEN,
  redactor,
}).create(Env.LOGS_LEVEL);

export const Logger: bg.LoggerPort = {
  [bg.NodeEnvironmentEnum.local]: LoggerWinstonLocalAdapter,
  [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.production]: LoggerWinstonProductionAdapter,
}[Env.type];
