import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const local = tools.DirectoryPathAbsoluteSchema.parse(`${__dirname}/profile-avatars`);
const prod = tools.DirectoryPathAbsoluteSchema.parse("/tmp/journal/avatars");

export const TemporaryFile: bg.TemporaryFilePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsolute(local),
  [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoop(local),
  [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoop(local),
  [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsolute(prod),
}[Env.type];

export const TemporaryFileDirectory: tools.DirectoryPathAbsoluteType = {
  [bg.NodeEnvironmentEnum.local]: local,
  [bg.NodeEnvironmentEnum.test]: local,
  [bg.NodeEnvironmentEnum.staging]: local,
  [bg.NodeEnvironmentEnum.production]: prod,
}[Env.type];
