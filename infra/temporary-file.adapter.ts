import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "+infra/env";

const local = tools.DirectoryPathAbsoluteSchema.parse(`${__dirname}/profile-avatars`);
const prod = tools.DirectoryPathAbsoluteSchema.parse("/tmp/journal/avatars");

// TODO add the dir to prerequisites
export const temporaryFile: bg.TemporaryFilePort = {
  [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsolute(local),
  [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoop(local),
  [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileNoop(local),
  [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsolute(prod),
}[Env.type];
