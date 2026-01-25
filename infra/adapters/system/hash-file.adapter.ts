import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashContent: new bg.HashContentSha256Strategy(),
    MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
    ...deps,
  });
}
