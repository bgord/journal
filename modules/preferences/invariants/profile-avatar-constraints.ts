import * as bg from "@bgord/bun";
import * as VO from "+preferences/value-objects";

class ProfileAvatarConstraintsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ProfileAvatarConstraintsError.prototype);
  }
}

type ProfileAvatarConstraintsConfigType = bg.ImageInfoType;

class ProfileAvatarConstraintsFactory extends bg.Invariant<ProfileAvatarConstraintsConfigType> {
  passes(config: ProfileAvatarConstraintsConfigType) {
    if (config.height > VO.ProfileAvatarMaxSide) return false;
    if (config.width > VO.ProfileAvatarMaxSide) return false;
    if (config.size.isGreaterThan(VO.ProfileAvatarMaxSize)) return false;
    return VO.ProfileAvatarMimeRegistry.hasMime(config.mime);
  }

  message = "profile.avatar.constraints";
  error = ProfileAvatarConstraintsError;
  kind = bg.InvariantFailureKind.precondition;
}

export const ProfileAvatarConstraints = new ProfileAvatarConstraintsFactory();
