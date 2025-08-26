import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as VO from "+preferences/value-objects";

class ProfileAvatarConstraintsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProfileAvatarConstraintsError.prototype);
  }
}

// TODO: use from bgord/bun
type ProfileAvatarConstraintsConfigType = {
  height: tools.HeightType;
  width: tools.WidthType;
  mime: tools.Mime;
  size: tools.Size;
};

class ProfileAvatarConstraintsFactory extends bg.Invariant<ProfileAvatarConstraintsConfigType> {
  fails(config: ProfileAvatarConstraintsConfigType) {
    if (config.height > VO.ProfileAvatarMaxSide) return true;
    if (config.width > VO.ProfileAvatarMaxSide) return false;
    if (config.size.isGreaterThan(VO.ProfileAvatarMaxSize)) return true;
    return VO.ProfileAvatarMimeTypes.every((allowed) => !allowed.isSatisfiedBy(config.mime));
  }

  message = "ProfileAvatarConstraints";

  error = ProfileAvatarConstraintsError;

  code = 400 as ContentfulStatusCode;
}

export const ProfileAvatarConstraints = new ProfileAvatarConstraintsFactory();
