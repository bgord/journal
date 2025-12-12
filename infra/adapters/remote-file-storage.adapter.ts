import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";
import { Clock } from "./clock.adapter";
import { FileCleaner } from "./file-cleaner.adapter";
import { FileHash } from "./file-hash.adapter";
import { FileRenamer } from "./file-renamer.adapter";
import { JsonFileReader } from "./json-file-reader.adapter";
import { Logger } from "./logger.adapter";

const production = tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/avatars");
const tmp = tools.DirectoryPathAbsoluteSchema.parse("/tmp");

const deps = { FileHash, FileCleaner, FileRenamer, JsonFileReader, Logger, Clock };

const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter({ root: tmp }, deps);

export const RemoteFileStorage: bg.RemoteFileStoragePort = {
  [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter({ root: tmp }, deps),
  [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
  [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageDiskAdapter({ root: production }, deps),
}[Env.type];
