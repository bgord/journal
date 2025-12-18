import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  HashFile: bg.HashFilePort;
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  JsonFileReader: bg.JsonFileReaderPort;
  Logger: bg.LoggerPort;
  Clock: bg.ClockPort;
};

export function createRemoteFileStorage(Env: EnvironmentType, deps: Dependencies) {
  const config = { root: tools.DirectoryPathAbsoluteSchema.parse("/tmp") };

  const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter(config, deps);

  return {
    [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter(config, deps),
    [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageDiskAdapter(
      { root: tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/avatars") },
      deps,
    ),
  }[Env.type];
}
