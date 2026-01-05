import * as bg from "@bgord/bun";
import * as VO from "+publishing/value-objects";

class ShareableLinkIsActiveError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShareableLinkIsActiveError.prototype);
  }
}

type ShareableLinkIsActiveConfigType = { status?: VO.ShareableLinkStatusEnum };

class ShareableLinkIsActiveFactory extends bg.Invariant<ShareableLinkIsActiveConfigType> {
  passes(config: ShareableLinkIsActiveConfigType) {
    return config.status === VO.ShareableLinkStatusEnum.active;
  }

  message = "shareable.link.is.active.error";
  error = ShareableLinkIsActiveError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ShareableLinkIsActive = new ShareableLinkIsActiveFactory();
