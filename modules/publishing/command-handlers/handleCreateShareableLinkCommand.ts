import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

export const handleCreateShareableLinkCommand =
  (ShareableLinksQuotaQuery: Publishing.Queries.ShareableLinksQuotaQuery) =>
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

    const events = shareableLink.pullEvents();

    await EventStore.save(events);
  };
