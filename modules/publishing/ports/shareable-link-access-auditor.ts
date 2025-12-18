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

type Dependencies = {
  EventStore: bg.EventStoreLike<Publishing.Events.ShareableLinkAccessedEventType>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export class ShareableLinkAccessAuditorAdapter implements Publishing.Ports.ShareableLinkAccessAuditorPort {
  constructor(private readonly deps: Dependencies) {}

  async record(input: Publishing.Ports.ShareableLinkAccessAuditorInput) {
    const event = Publishing.Events.ShareableLinkAccessedEvent.parse({
      ...bg.createEventEnvelope(`shareable_link_${input.linkId}`, this.deps),
      name: Publishing.Events.SHAREABLE_LINK_ACCESSED_EVENT,
      payload: {
        shareableLinkId: input.linkId,
        ownerId: input.ownerId,
        publicationSpecification: input.publicationSpecification,
        validity: input.validity,
        reason: input.reason,
        visitorId: input.context.visitorId.get(),
        timestamp: input.context.timestamp,
      },
    } satisfies Publishing.Events.ShareableLinkAccessedEventType);

    await this.deps.EventStore.save([event]);
  }
}
