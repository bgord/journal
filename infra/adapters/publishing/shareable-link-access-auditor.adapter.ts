import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { EventStore } from "+infra/event-store";

class ShareableLinkAccessAuditorBg implements Publishing.Ports.ShareableLinkAccessAuditorPort {
  constructor() {}

  async record(input: Publishing.Ports.ShareableLinkAccessAuditorInput) {
    const event = Publishing.Events.ShareableLinkAccessedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: Publishing.Events.SHAREABLE_LINK_ACCESSED_EVENT,
      stream: `shareable_link_${input.linkId}`,
      version: 1,
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

export const ShareableLinkAccessAuditor = new ShareableLinkAccessAuditorBg();
