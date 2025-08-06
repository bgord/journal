import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class ShareableLinkIsActiveError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShareableLinkIsActiveError.prototype);
  }
}

type ShareableLinkIsActiveConfigType = { status?: VO.ShareableLinkStatusEnum };

class ShareableLinkIsActiveFactory extends bg.Policy<ShareableLinkIsActiveConfigType> {
  fails(config: ShareableLinkIsActiveConfigType) {
    return config.status !== VO.ShareableLinkStatusEnum.active;
  }

  message = "ShareableLinkIsActiveError";

  error = ShareableLinkIsActiveError;

  code = 403 as ContentfulStatusCode;
}

export const ShareableLinkIsActive = new ShareableLinkIsActiveFactory();
