import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";
import { Clock } from "../adapters/clock.adapter";
import { LoggerWinstonLocalAdapter } from "../adapters/logger.adapter";
import { FileHash } from "./file-hash.adapter";

const tmpFileStorage = new bg.RemoteFileStorageDiskAdapter({
  hasher: FileHash,
  root: tools.DirectoryPathAbsoluteSchema.parse("/tmp"),
});

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: tmpFileStorage,
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({
    Logger: LoggerWinstonLocalAdapter,
    Clock,
  }),
  [bg.NodeEnvironmentEnum.staging]: tmpFileStorage,
  [bg.NodeEnvironmentEnum.production]: tmpFileStorage,
}[Env.type];
