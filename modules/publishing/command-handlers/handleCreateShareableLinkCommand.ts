import { EventStore } from "+infra/event-store";
import * as Publishing from "+publishing";

export const handleCreateShareableLinkCommand = async (
  command: Publishing.Commands.CreateShareableLinkCommandType,
) => {
  const shareableLinksPerOwnerCount = await Publishing.Queries.CountShareableLinksPerOwner.execute(
    command.payload.requesterId,
  );
  Publishing.Policies.ShareableLinksPerOwnerLimit.perform(shareableLinksPerOwnerCount);

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
