import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export function createImageInfo(deps: Dependencies): bg.ImageInfoPort {
  return new bg.ImageInfoAdapter({ MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry, ...deps });
}
