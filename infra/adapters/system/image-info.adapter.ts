import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = { FileInspection: bg.FileInspectionPort };

export async function createImageInfo(deps: Dependencies): Promise<bg.ImageInfoPort> {
  return await bg.ImageInfoSharpAdapter.build({
    MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
    ...deps,
  });
}
