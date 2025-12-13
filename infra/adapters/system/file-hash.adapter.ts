import * as bg from "@bgord/bun";

export function createFileHash() {
  return new bg.FileHashSha256BunAdapter();
}
