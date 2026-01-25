import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort; FileReaderText: bg.FileReaderTextPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    HashContent: new bg.HashContentSha256Strategy(),
    MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
    ...deps,
  });
}
