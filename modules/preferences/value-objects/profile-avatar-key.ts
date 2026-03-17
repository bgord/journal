import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";

export class ProfileAvatarKeyFactory {
  static stable(userId: Auth.VO.UserIdType) {
    const filename = tools.Filename.fromParts("avatar", "webp");

    return v.parse(tools.ObjectKey, `users/${userId}/${filename.get()}`);
  }
}
