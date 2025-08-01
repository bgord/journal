import { EventStore } from "+infra/event-store";
import * as Publishing from "+publishing";

export const handleRevokeShareableLinkCommand = async (
  command: Publishing.Commands.RevokeShareableLinkCommandType,
) => {
  const history = await EventStore.find(
    Publishing.Aggregates.ShareableLink.events,
    Publishing.Aggregates.ShareableLink.getStream(command.payload.shareableLinkId),
  );

  const shareableLink = Publishing.Aggregates.ShareableLink.build(command.payload.shareableLinkId, history);
  command.revision.validate(shareableLink.revision.value);
  shareableLink.revoke();

  await EventStore.save(shareableLink.pullEvents());
};
