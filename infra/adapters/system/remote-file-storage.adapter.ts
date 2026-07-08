import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { name } from "+infra/config";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  HashFile: bg.HashFilePort;
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  NonceProvider: bg.NonceProviderPort;
  Logger: bg.LoggerPort;
  Clock: bg.ClockPort;
};

export function createRemoteFileStorage(Env: EnvironmentResultType, deps: Dependencies) {
  const config = { root: v.parse(tools.DirectoryPathAbsoluteSchema, "/tmp") };

  const FileCopier = new bg.FileCopierAdapter();
  const DirectoryEnsurer = new bg.DirectoryEnsurerAdapter();

  const RemoteFileStorageTmp = new bg.RemoteFileStorageDiskAdapter(config, {
    ...deps,
    FileCopier,
    DirectoryEnsurer,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.test]: new bg.RemoteFileStorageNoopAdapter(config, deps),
    [bg.NodeEnvironmentEnum.staging]: RemoteFileStorageTmp,
    [bg.NodeEnvironmentEnum.production]: new bg.RemoteFileStorageDiskAdapter(
      { root: v.parse(tools.DirectoryPathAbsoluteSchema, `/var/www/${name}/infra/avatars`) },
      { ...deps, FileCopier, DirectoryEnsurer },
    ),
  }[Env.type];
}
