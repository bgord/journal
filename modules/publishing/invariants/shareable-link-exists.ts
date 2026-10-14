import * as bg from "@bgord/bun";

class ShareableLinkExistsError extends Error {}

type ShareableLinkExistsConfigType = { shareableLink: object | undefined };
type ShareableLinkExistsPassedConfigType = { shareableLink: object };

class ShareableLinkExistsFactory extends bg.Invariant<
  ShareableLinkExistsConfigType,
  ShareableLinkExistsPassedConfigType
> {
  passes(config: ShareableLinkExistsConfigType) {
    return config.shareableLink !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "shareable.link.exists";
  error = ShareableLinkExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const ShareableLinkExists = new ShareableLinkExistsFactory();
