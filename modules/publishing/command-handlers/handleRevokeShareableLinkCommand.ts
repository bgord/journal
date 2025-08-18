import type * as Publishing from "+publishing";

export const handleRevokeShareableLinkCommand =
  (repo: Publishing.Ports.ShareableLinkRepositoryPort) =>
  async (command: Publishing.Commands.RevokeShareableLinkCommandType) => {
    const shareableLink = await repo.load(command.payload.shareableLinkId);
    command.revision.validate(shareableLink.revision.value);
    shareableLink.revoke(command.payload.requesterId);
    await repo.save(shareableLink);
  };
