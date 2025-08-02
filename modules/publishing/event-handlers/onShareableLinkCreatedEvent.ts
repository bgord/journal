import * as Publishing from "+publishing";

export const onShareableLinkCreatedEvent = async (event: Publishing.Events.ShareableLinkCreatedEventType) => {
  await Publishing.Repos.ShareableLinkRepository.create(event);
};
