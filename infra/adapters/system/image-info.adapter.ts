import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createImageInfo(deps: Dependencies) {
  return new bg.ImageInfoSharpAdapter({ MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry, ...deps });
}
