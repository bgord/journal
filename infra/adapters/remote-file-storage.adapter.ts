import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import {
  Clock,
  FileCleaner,
  FileHash,
  FileRenamer,
  JsonFileReader,
  LoggerWinstonLocalAdapter,
} from "+infra/adapters";
import { Env } from "+infra/env";

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
