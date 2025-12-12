import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { FileCleaner } from "+infra/adapters/file-cleaner.adapter";
import { FileRenamer } from "+infra/adapters/file-renamer.adapter";
import { Env } from "+infra/env";

const local = tools.DirectoryPathAbsoluteSchema.parse(`${__dirname}/profile-avatars`);
const prod = tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/tmp-avatars");

const deps = { FileCleaner, FileRenamer };

export const TemporaryFile: bg.TemporaryFilePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsoluteAdapter(local, deps),
  [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoopAdapter(local),
  [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoopAdapter(local),
  [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsoluteAdapter(prod, deps),
}[Env.type];
