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
  passes(config: ShareableLinkExpirationTimePassedConfigType) {
    // Stryker disable all
    if (!config.createdAt) return false;
    if (!config.durationMs) return false;
    // Stryker restore all
    return tools.Timestamp.fromValue(config.createdAt)
      .add(tools.Duration.Ms(config.durationMs))
      .isBefore(config.now);
  }

  // Stryker disable next-line StringLiteral
  message = "shareable.link.expiration.time.passed";
  error = ShareableLinkExpirationTimePassedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ShareableLinkExpirationTimePassed = new ShareableLinkExpirationTimePassedFactory();
