import * as bg from "@bgord/bun";

export function createFileHash(): bg.FileHashPort {
  return new bg.FileHashSha256BunAdapter();
}
