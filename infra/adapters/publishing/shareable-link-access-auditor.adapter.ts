import * as bg from "@bgord/bun";
import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

class ShareableLinkAccessAuditorInternal implements Publishing.Ports.ShareableLinkAccessAuditorPort {
  constructor() {}

  async record(input: Publishing.Ports.ShareableLinkAccessAuditorInput) {
    const event = Publishing.Events.ShareableLinkAccessedEvent.parse({
      ...bg.createEventEnvelope(`shareable_link_${input.linkId}`),
      name: Publishing.Events.SHAREABLE_LINK_ACCESSED_EVENT,
      payload: {
        shareableLinkId: input.linkId,
        ownerId: input.ownerId,
        publicationSpecification: input.publicationSpecification,
        validity: input.validity,
        reason: input.reason,
        visitorId: await input.context.visitorId.get(),
        timestamp: input.context.timestamp,
      },
    } satisfies Publishing.Events.ShareableLinkAccessedEventType);

    await EventStore.save([event]);
  }
}

export const ShareableLinkAccessAuditor = new ShareableLinkAccessAuditorInternal();
