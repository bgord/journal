import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

export const HashFile = new bg.HashFileSha256BunAdapter({
  HashContent: new bg.HashContentSha256BunStrategy(),
  MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
});
