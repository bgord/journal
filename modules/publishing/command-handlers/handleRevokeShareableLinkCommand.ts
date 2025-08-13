import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

export const handleRevokeShareableLinkCommand = async (
  command: Publishing.Commands.RevokeShareableLinkCommandType,
) => {
  const history = await EventStore.find(
    Publishing.Aggregates.ShareableLink.events,
    Publishing.Aggregates.ShareableLink.getStream(command.payload.shareableLinkId),
  );

  const shareableLink = Publishing.Aggregates.ShareableLink.build(command.payload.shareableLinkId, history);
  command.revision.validate(shareableLink.revision.value);
  shareableLink.revoke(command.payload.requesterId);

  await EventStore.save(shareableLink.pullEvents());
};
