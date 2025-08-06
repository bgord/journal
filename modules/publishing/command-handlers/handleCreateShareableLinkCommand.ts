import { EventStore } from "+infra/event-store";
import * as Publishing from "+publishing";

export const handleCreateShareableLinkCommand = async (
  command: Publishing.Commands.CreateShareableLinkCommandType,
) => {
  const shareableActiveLinksPerOwnerCount =
    await Publishing.Queries.CountActiveShareableLinksPerOwner.execute(command.payload.requesterId);

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
