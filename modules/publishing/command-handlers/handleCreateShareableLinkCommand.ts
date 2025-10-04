import type * as bg from "@bgord/bun";
import * as Publishing from "+publishing";

type Dependencies = {
  repo: Publishing.Ports.ShareableLinkRepositoryPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ShareableLinksQuotaQuery: Publishing.Queries.ShareableLinksQuotaQuery;
};

export const handleCreateShareableLinkCommand =
  (deps: Dependencies) => async (command: Publishing.Commands.CreateShareableLinkCommandType) => {
    const shareableActiveLinksPerOwnerCount = await deps.ShareableLinksQuotaQuery.execute(
      command.payload.requesterId,
    );

    Publishing.Invariants.ShareableLinksPerOwnerLimit.perform(shareableActiveLinksPerOwnerCount);

    const shareableLink = Publishing.Aggregates.ShareableLink.create(
      command.payload.shareableLinkId,
      command.payload.publicationSpecification,
      command.payload.dateRange,
      command.payload.durationMs,
      command.payload.requesterId,
      deps,
    );

    await deps.repo.save(shareableLink);
  };
