import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileWriter: bg.FileWriterPort;
};

export function createTemporaryFile(Env: EnvironmentType, deps: Dependencies): bg.TemporaryFilePort {
  const local = tools.DirectoryPathAbsoluteSchema.parse(`${__dirname}/profile-avatars`);
  const production = tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/tmp-avatars");

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsoluteAdapter(local, deps),
    [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoopAdapter(local),
    [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoopAdapter(local),
    [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsoluteAdapter(production, deps),
  }[Env.type];
}
