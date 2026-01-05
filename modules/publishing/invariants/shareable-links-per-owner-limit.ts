import * as bg from "@bgord/bun";
import type { ShareableLinksQuotaQuery } from "+publishing/queries";

class ShareableLinksPerOwnerLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShareableLinksPerOwnerLimitError.prototype);
  }
}

type ShareableLinksPerOwnerLimitConfigType = Awaited<ReturnType<ShareableLinksQuotaQuery["execute"]>>;

class ShareableLinksPerOwnerLimitFactory extends bg.Invariant<ShareableLinksPerOwnerLimitConfigType> {
  fails(config: ShareableLinksPerOwnerLimitConfigType) {
    return config.count >= 3;
  }

  message = "ShareableLinksPerOwnerLimit";
  error = ShareableLinksPerOwnerLimitError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ShareableLinksPerOwnerLimit = new ShareableLinksPerOwnerLimitFactory();
