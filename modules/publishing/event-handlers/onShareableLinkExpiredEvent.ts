import * as Publishing from "+publishing";

export const onShareableLinkExpiredEvent = async (event: Publishing.Events.ShareableLinkExpiredEventType) => {
  await Publishing.Repos.ShareableLinkRepository.expire(event);
};
