import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const local = tools.DirectoryPathAbsoluteSchema.parse(`${__dirname}/profile-avatars`);
const prod = tools.DirectoryPathAbsoluteSchema.parse("/var/www/journal/infra/tmp-avatars");

export const TemporaryFile: bg.TemporaryFilePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsoluteAdapter(local),
  [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoopAdapter(local),
  [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoopAdapter(local),
  [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsoluteAdapter(prod),
}[Env.type];

export const TemporaryFileDirectory: tools.DirectoryPathAbsoluteType = {
  [bg.NodeEnvironmentEnum.local]: local,
  [bg.NodeEnvironmentEnum.test]: local,
  [bg.NodeEnvironmentEnum.staging]: local,
  [bg.NodeEnvironmentEnum.production]: prod,
}[Env.type];
