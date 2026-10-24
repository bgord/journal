import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createHashFile(deps: Dependencies) {
  return new bg.HashFileMetadataAdapter({
    MimeRegistry: Preferences.VO.ProfileAvatar.MimeRegistry,
    HashContent: new bg.HashContentSha256Strategy(),
    ...deps,
  });
}
