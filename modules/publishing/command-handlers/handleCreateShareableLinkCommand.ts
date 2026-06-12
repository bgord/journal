import type * as bg from "@bgord/bun";
import type * as Publishing from "+publishing";
import { ShareableLink } from "../aggregates/shareable-link";
import { ShareableLinksPerOwnerLimit } from "../invariants/shareable-links-per-owner-limit";

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

    ShareableLinksPerOwnerLimit.enforce(shareableActiveLinksPerOwnerCount);

    const shareableLink = ShareableLink.create(
      command.payload.shareableLinkId,
      command.payload.publicationSpecification,
      command.payload.dateRange,
      command.payload.durationMs,
      command.payload.requesterId,
      deps,
    );

    await deps.repo.save(shareableLink);
  };
