import * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import * as Publishing from "+publishing";

export type ShareableLinkAccessAuditorInput = {
  linkId: Publishing.VO.ShareableLinkIdType;
  ownerId: Auth.VO.UserIdType;
  validity: Publishing.VO.AccessValidity;
  publicationSpecification: Publishing.VO.PublicationSpecificationType;
  reason: string;
  context: Publishing.VO.AccessContext;
};

export interface ShareableLinkAccessAuditorPort {
  record(input: ShareableLinkAccessAuditorInput): Promise<void>;
}

export class ShareableLinkAccessAuditorAdapter implements Publishing.Ports.ShareableLinkAccessAuditorPort {
  constructor(
    private readonly EventStore: bg.EventStoreLike<Publishing.Events.ShareableLinkAccessedEventType>,
    private readonly IdProvider: bg.IdProviderPort,
  ) {}

  async record(input: Publishing.Ports.ShareableLinkAccessAuditorInput) {
    const event = Publishing.Events.ShareableLinkAccessedEvent.parse({
      ...bg.createEventEnvelope(this.IdProvider, `shareable_link_${input.linkId}`),
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

    await this.EventStore.save([event]);
  }
}
