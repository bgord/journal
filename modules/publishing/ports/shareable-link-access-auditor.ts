import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import * as Publishing from "+publishing";
import * as wip from "+infra/build";

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
  EventStore: bg.EventStorePort<Publishing.Events.ShareableLinkAccessedEventType>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export class ShareableLinkAccessAuditorAdapter implements Publishing.Ports.ShareableLinkAccessAuditorPort {
  constructor(private readonly deps: Dependencies) {}

  async record(input: Publishing.Ports.ShareableLinkAccessAuditorInput) {
    const event = wip.event(
      Publishing.Events.ShareableLinkAccessedEvent,
      `shareable_link_${input.linkId}`,
      {
        payload: {
          shareableLinkId: input.linkId,
          ownerId: input.ownerId,
          publicationSpecification: input.publicationSpecification,
          validity: input.validity,
          reason: input.reason,
          visitorId: input.context.visitorId.get(),
          timestamp: input.context.timestamp,
        },
      },
      this.deps,
    );

    await this.deps.EventStore.save([event]);
  }
}
