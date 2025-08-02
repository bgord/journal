import * as Publishing from "+publishing";

export const onShareableLinkRevokedEvent = async (event: Publishing.Events.ShareableLinkRevokedEventType) => {
  await Publishing.Repos.ShareableLinkRepository.revoke(event);
};
