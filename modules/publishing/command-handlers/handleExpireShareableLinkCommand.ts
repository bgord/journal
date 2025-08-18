import * as Publishing from "+publishing";

export const handleExpireShareableLinkCommand =
  (repo: Publishing.Ports.ShareableLinkRepositoryPort) =>
  async (command: Publishing.Commands.ExpireShareableLinkCommandType) => {
    const shareableLink = await repo.load(command.payload.shareableLinkId);
    shareableLink.expire();
    await repo.save(shareableLink);
  };
