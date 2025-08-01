import { CountShareableLinksPerOwner } from "+publishing/queries";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class ShareableLinksPerOwnerLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShareableLinksPerOwnerLimitError.prototype);
  }
}

type ShareableLinksPerOwnerLimitConfigType = Awaited<ReturnType<typeof CountShareableLinksPerOwner.execute>>;

class ShareableLinksPerOwnerLimitFactory extends bg.Policy<ShareableLinksPerOwnerLimitConfigType> {
  fails(config: ShareableLinksPerOwnerLimitConfigType) {
    return config.count >= 50;
  }

  message = "ShareableLinksPerOwnerLimit";

  error = ShareableLinksPerOwnerLimitError;

  code = 403 as ContentfulStatusCode;
}

export const ShareableLinksPerOwnerLimit = new ShareableLinksPerOwnerLimitFactory();
