import * as bg from "@bgord/bun";
import { Env } from "+infra/env";

const app = "lobbygow";

export const LoggerWinstonLocalAdapter = new bg.LoggerWinstonLocalAdapter({ app }).create(Env.LOGS_LEVEL);

export const LoggerWinstonProductionAdapter = new bg.LoggerWinstonProductionAdapter({
  app,
  AXIOM_API_TOKEN: Env.AXIOM_API_TOKEN,
});

export const logger: bg.LoggerPort = {
  [bg.NodeEnvironmentEnum.local]: LoggerWinstonLocalAdapter,
  [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
  [bg.NodeEnvironmentEnum.production]: LoggerWinstonProductionAdapter.create(Env.LOGS_LEVEL),
}[Env.type];
