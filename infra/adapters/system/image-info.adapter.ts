import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

export const ImageInfo = new bg.ImageInfoSharpAdapter({
  MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
});
