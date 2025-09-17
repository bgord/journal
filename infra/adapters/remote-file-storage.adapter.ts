import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";
import { Clock } from "../adapters/clock.adapter";
import { LoggerWinstonLocalAdapter } from "../adapters/logger.adapter";
import { FileHash } from "./file-hash.adapter";

export const RemoteFileStorageTmpRootDir = tools.DirectoryPathAbsoluteSchema.parse("/tmp");

const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter({
  hasher: FileHash,
  root: RemoteFileStorageTmpRootDir,
});

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({
    Logger: LoggerWinstonLocalAdapter,
    Clock,
  }),
  [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.production]: RemoteFileStorageTmp,
}[Env.type];
