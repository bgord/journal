import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

export const HashFile = new bg.HashFileSha256Adapter({
  HashContent: new bg.HashContentSha256Strategy(),
  MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
});
