import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { name } from "+infra/config";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  AtomicFileWriter: bg.AtomicFileWriterPort;
  HashFile: bg.HashFilePort;
  FileCleaner: bg.FileCleanerPort;
  FileInspection: bg.FileInspectionPort;
  Logger: bg.LoggerPort;
  Clock: bg.ClockPort;
};

export function createRemoteFileStorage(Env: EnvironmentResultType, deps: Dependencies) {
  const config = { root: v.parse(tools.DirectoryPathAbsoluteSchema, "/tmp") };

  const DirectoryEnsurer = new bg.DirectoryEnsurerAdapter();

  const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter(config, { ...deps, DirectoryEnsurer });

  return {
    [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter(config, deps),
    [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageDiskAdapter(
      { root: v.parse(tools.DirectoryPathAbsoluteSchema, `/var/www/${name}/infra/avatars`) },
      { ...deps, DirectoryEnsurer },
    ),
  }[Env.type];
}
