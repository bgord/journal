import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

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
    // Stryker disable all
    if (!config.createdAt) return true;
    if (!config.durationMs) return true;
    // Stryker restore all
    return tools.Timestamp.fromValue(config.createdAt)
      .add(tools.Duration.Ms(config.durationMs))
      .isAfter(config.now);
  }

  // Stryker disable all
  message = "shareable.link.expiration.time.passed";
  // Stryker restore all
  error = ShareableLinkExpirationTimePassedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ShareableLinkExpirationTimePassed = new ShareableLinkExpirationTimePassedFactory();
