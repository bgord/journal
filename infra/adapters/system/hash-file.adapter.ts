import * as bg from "@bgord/bun";

type Dependencies = { HashContent: bg.HashContentPort };

export function createHashFile(deps: Dependencies): bg.HashFilePort {
  return new bg.HashFileSha256BunAdapter(deps);
}
