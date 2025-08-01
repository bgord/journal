import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class ShareableLinkExpirationTimePassedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShareableLinkExpirationTimePassedError.prototype);
  }
}

type ShareableLinkExpirationTimePassedConfigType = {
  now: number;
  createdAt?: tools.TimestampType;
  duration?: tools.TimeResult;
};

class ShareableLinkExpirationTimePassedFactory extends bg.Policy<ShareableLinkExpirationTimePassedConfigType> {
  fails(config: ShareableLinkExpirationTimePassedConfigType) {
    if (!config.createdAt) return true;
    if (!config.duration) return true;
    return config.createdAt + config.duration.ms < config.now;
  }

  message = "ShareableLinkExpirationTimePassed";

  error = ShareableLinkExpirationTimePassedError;

  code = 403 as ContentfulStatusCode;
}

export const ShareableLinkExpirationTimePassed = new ShareableLinkExpirationTimePassedFactory();
