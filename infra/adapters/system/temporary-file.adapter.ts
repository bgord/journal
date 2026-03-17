import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  FileCleaner: bg.FileCleanerPort;
  FileRenamer: bg.FileRenamerPort;
  FileWriter: bg.FileWriterPort;
};

export function createTemporaryFile(Env: EnvironmentResultType, deps: Dependencies): bg.TemporaryFilePort {
  const local = v.parse(tools.DirectoryPathAbsoluteSchema, `${__dirname}/profile-avatars`);
  const production = v.parse(tools.DirectoryPathAbsoluteSchema, "/var/www/journal/infra/tmp-avatars");

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsoluteAdapter(local, deps),
    [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoopAdapter(local),
    [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoopAdapter(local),
    [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsoluteAdapter(production, deps),
  }[Env.type];
}
