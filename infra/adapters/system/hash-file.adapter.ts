import * as bg from "@bgord/bun";

export const HashFile = new bg.HashFileSha256BunAdapter({
  HashContent: new bg.HashContentSha256BunStrategy(),
});
