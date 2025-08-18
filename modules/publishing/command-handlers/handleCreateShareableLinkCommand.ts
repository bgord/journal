import * as Publishing from "+publishing";

export const handleCreateShareableLinkCommand =
  (
    repo: Publishing.Ports.ShareableLinkRepositoryPort,
    ShareableLinksQuotaQuery: Publishing.Queries.ShareableLinksQuotaQuery,
  ) =>
  async (command: Publishing.Commands.CreateShareableLinkCommandType) => {
    const shareableActiveLinksPerOwnerCount = await ShareableLinksQuotaQuery.execute(
      command.payload.requesterId,
    );

    Publishing.Invariants.ShareableLinksPerOwnerLimit.perform(shareableActiveLinksPerOwnerCount);

    const shareableLink = Publishing.Aggregates.ShareableLink.create(
      command.payload.shareableLinkId,
      command.payload.publicationSpecification,
      command.payload.dateRange,
      command.payload.duration,
      command.payload.requesterId,
    );

    await repo.save(shareableLink);
  };
