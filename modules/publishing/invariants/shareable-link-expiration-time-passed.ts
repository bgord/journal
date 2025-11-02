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
  now: tools.Timestamp;
  createdAt?: tools.TimestampValueType;
  durationMs?: tools.DurationMsType;
};

class ShareableLinkExpirationTimePassedFactory extends bg.Invariant<ShareableLinkExpirationTimePassedConfigType> {
  fails(config: ShareableLinkExpirationTimePassedConfigType) {
    if (!config.createdAt) return true;
    if (!config.durationMs) return true;
    return tools.Timestamp.fromValue(config.createdAt)
      .add(tools.Duration.Ms(config.durationMs))
      .isAfter(config.now);
  }

  message = "ShareableLinkExpirationTimePassed";

  error = ShareableLinkExpirationTimePassedError;

  code = 403 as ContentfulStatusCode;
}

export const ShareableLinkExpirationTimePassed = new ShareableLinkExpirationTimePassedFactory();
