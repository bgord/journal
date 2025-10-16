import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";
import { Clock } from "./clock.adapter";
import { FileCleaner } from "./file-cleaner.adapter";
import { FileHash } from "./file-hash.adapter";
import { FileRenamer } from "./file-renamer.adapter";
import { JsonFileReader } from "./json-file-reader.adapter";
import { LoggerWinstonLocalAdapter } from "./logger.adapter";

export const RemoteFileStorageProductionDir = tools.DirectoryPathAbsoluteSchema.parse(
  "/var/www/journal/infra/avatars",
);

const deps = { FileHash, FileCleaner, FileRenamer, JsonFileReader };

const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter(
  { root: tools.DirectoryPathAbsoluteSchema.parse("/tmp") },
  deps,
);

const RemoteFileStorageProduction = new bg.RemoteFileStorageDiskAdapter(
  { root: RemoteFileStorageProductionDir },
  deps,
);

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({
    Logger: LoggerWinstonLocalAdapter,
    Clock,
  }),
  [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.production]: RemoteFileStorageProduction,
}[Env.type];
