import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  const HashContent = new bg.HashContentSha256Strategy();

  return new bg.HashFileSha256Adapter({
    MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
    FileReaderText: new bg.FileReaderTextAdapter(),
    HashContent,
    ...deps,
  });
}
