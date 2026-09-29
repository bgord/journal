import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileSha256Adapter({
    MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
    FileReaderRaw: new bg.FileReaderRawAdapter(),
    HashBytes: new bg.HashBytesSha256Strategy(),
    ...deps,
  });
}
