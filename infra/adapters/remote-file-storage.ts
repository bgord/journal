import * as bg from "@bgord/bun";
import { Env } from "+infra/env";
import { LoggerWinstonLocalAdapter } from "../logger.adapter";

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonLocalAdapter,
  }),
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonLocalAdapter,
  }),
  [bg.NodeEnvironmentEnum.staging]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonLocalAdapter,
  }),
  [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageNoopAdapter({
    logger: LoggerWinstonLocalAdapter,
  }),
}[Env.type];
