import * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export class ProfileAvatarKeyFactory {
  static stable(userId: Auth.VO.UserIdType) {
    const filename = tools.Filename.fromParts("avatar", "webp");

    return tools.ObjectKey.parse(`users/${userId}/${filename.get()}`);
  }
}
