import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";
import { Clock } from "./clock.adapter";
import { FileCleaner } from "./file-cleaner.adapter";
import { FileHash } from "./file-hash.adapter";
import { FileRenamer } from "./file-renamer.adapter";
import { JsonFileReader } from "./json-file-reader.adapter";
import { Logger } from "./logger.adapter";

const deps = { FileHash, FileCleaner, FileRenamer, JsonFileReader, Logger, Clock };
const config = { root: tools.DirectoryPathAbsoluteSchema.parse("/tmp") };

const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter(config, deps);

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter(config, deps),
  [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageDiskAdapter(
    { root: tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/avatars") },
    deps,
  ),
}[Env.type];
