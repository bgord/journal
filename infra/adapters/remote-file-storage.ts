import * as bg from "@bgord/bun";
import { Env } from "+infra/env";
import { LoggerWinstonProductionAdapter } from "../logger.adapter";

export const logger: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonProductionAdapter.create(bg.LogLevelEnum.info),
  }),
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonProductionAdapter.create(bg.LogLevelEnum.info),
  }),
  [bg.NodeEnvironmentEnum.staging]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonProductionAdapter.create(bg.LogLevelEnum.info),
  }),
  [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonProductionAdapter.create(bg.LogLevelEnum.info),
  }),
}[Env.type];
