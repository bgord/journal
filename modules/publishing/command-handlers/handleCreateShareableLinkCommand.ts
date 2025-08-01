import { EventStore } from "+infra/event-store";
import * as Publishing from "+publishing";

export const handleCreateShareableLinkCommand = async (
  command: Publishing.Commands.CreateShareableLinkCommandType,
) => {
  const shareableLinkId = crypto.randomUUID();

  const shareableLink = Publishing.Aggregates.ShareableLink.create(
    shareableLinkId,
    command.payload.publicationSpecification,
    command.payload.dateRange,
    command.payload.duration,
    command.payload.requesterId,
  );

  await EventStore.save(shareableLink.pullEvents());
};
