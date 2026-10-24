import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";

export class ProfileAvatar {
  static readonly MaxSide = v.parse(tools.ImageWidth, 4000);
  static readonly MaxSize = tools.Size.fromMB(10);
  static readonly MimeRegistry = new tools.MimeRegistry([tools.Mimes.png, tools.Mimes.jpg, tools.Mimes.webp]);
  static readonly Side = v.parse(tools.ImageWidth, 256);

  static key(userId: Auth.VO.UserIdType): tools.ObjectKeyType {
    const filename = tools.Filename.fromParts("avatar", "webp");

    return v.parse(tools.ObjectKey, `users/${userId}/${filename.get()}`);
  }
}
